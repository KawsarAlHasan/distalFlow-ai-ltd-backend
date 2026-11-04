import { StatusCodes } from "http-status-codes";
import ApiError from "../../../errors/ApiError";
import { dbClient } from "../../../lib/prisma";
import {
  AuditAction,
  MigrationMode,
  PlanType,
  PriceStatus,
  Prisma,
} from "../../../../generated/prisma/client";

/* ------------------------------------------------------------------ */
/*  Seed data – matches frontend seedTiers exactly.                   */
/*  Amounts are in minor units (pence): £997 → 99700.                 */
/* ------------------------------------------------------------------ */

type SeedPlan = {
  type: PlanType;
  name: string;
  accent: string;
  campaigns: string;
  campaignLimit: number | null;
  isUnlimitedCampaign: boolean;
  locations: string;
  locationLimit: number | null;
  isUnlimitedLocation: boolean;
  selfServe: boolean;
  additionalSiteAmount?: number;
  additionalSiteSetup?: number;
  initialPrice: { amount: number; setupFee: number };
};

const seedPlans: SeedPlan[] = [
  {
    type: PlanType.SOLO,
    name: "Solo",
    accent: "#6366f1",
    campaigns: "1 active campaign",
    campaignLimit: 1,
    isUnlimitedCampaign: false,
    locations: "Single location",
    locationLimit: 1,
    isUnlimitedLocation: false,
    selfServe: true,
    initialPrice: { amount: 99700, setupFee: 49700 },
  },
  {
    type: PlanType.GROWTH,
    name: "Growth",
    accent: "#0891b2",
    campaigns: "3 active campaigns",
    campaignLimit: 3,
    isUnlimitedCampaign: false,
    locations: "Single location",
    locationLimit: 1,
    isUnlimitedLocation: false,
    selfServe: true,
    initialPrice: { amount: 149700, setupFee: 49700 },
  },
  {
    type: PlanType.PRO,
    name: "Pro",
    accent: "#b45309",
    campaigns: "Unlimited campaigns",
    campaignLimit: null,
    isUnlimitedCampaign: true,
    locations: "Single location",
    locationLimit: 1,
    isUnlimitedLocation: false,
    selfServe: true,
    initialPrice: { amount: 229700, setupFee: 49700 },
  },
  {
    type: PlanType.ENTERPRISE,
    name: "Enterprise",
    accent: "#7c3aed",
    campaigns: "Unlimited campaigns",
    campaignLimit: null,
    isUnlimitedCampaign: true,
    locations: "Multiple locations · group reporting",
    locationLimit: null,
    isUnlimitedLocation: true,
    selfServe: false, // forced – never self-serve
    additionalSiteAmount: 99700,
    additionalSiteSetup: 49700,
    initialPrice: { amount: 299700, setupFee: 99400 },
  },
];

/* ------------------------------------------------------------------ */
/*  Helpers                                                           */
/* ------------------------------------------------------------------ */

const planTypeToKey = (type: PlanType): string => type.toLowerCase();

const getPlanTypeFromKey = (key: string): PlanType => {
  const upper = key.toUpperCase() as PlanType;
  if (!Object.values(PlanType).includes(upper)) {
    throw new ApiError(StatusCodes.BAD_REQUEST, `Invalid plan type: ${key}`);
  }
  return upper;
};

// Format a date to YYYY-MM-DD
const formatDate = (date: Date): string => date.toISOString().slice(0, 10);

// Convert amount from minor to GBP string for audit logs (display only)
const gbp = (amount: number): string =>
  new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  }).format(amount / 100);

/* ------------------------------------------------------------------ */
/*  Service functions                                                 */
/* ------------------------------------------------------------------ */

// ------------------------- Initialize -------------------------------
export const initializePlanService = async () => {
  const count = await dbClient.plan.count();
  if (count > 0) {
    return { message: "Plans already exist, nothing to seed" };
  }

  // Create all plans and their initial prices in a transaction
  await dbClient.$transaction(async (tx) => {
    for (const seed of seedPlans) {
      const plan = await tx.plan.create({
        data: {
          type: seed.type,
          name: seed.name,
          accent: seed.accent,
          campaigns: seed.campaigns,
          campaignLimit: seed.campaignLimit,
          isUnlimitedCampaign: seed.isUnlimitedCampaign,
          locations: seed.locations,
          locationLimit: seed.locationLimit,
          isUnlimitedLocation: seed.isUnlimitedLocation,
          selfServe: seed.selfServe,
          additionalSiteAmount: seed.additionalSiteAmount,
          additionalSiteSetup: seed.additionalSiteSetup,
        },
      });

      await tx.planPrice.create({
        data: {
          stripePriceId: `price_${seed.type.toLowerCase()}_v1`,
          planId: plan.id,
          amount: seed.initialPrice.amount,
          setupFee: seed.initialPrice.setupFee,
          status: PriceStatus.ACTIVE,
        },
      });
    }
  });

  return { message: "Plans seeded successfully" };
};

// ------------------------- Get Plans --------------------------------
export const getPlansService = async () => {
  // Auto-initialize if no plans exist
  const count = await dbClient.plan.count();
  if (count === 0) {
    await initializePlanService();
  }

  const plans = await dbClient.plan.findMany({
    include: {
      prices: {
        include: {
          subscriptions: true, // to count subscribers
        },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  // Build response to match frontend structure (amounts in pounds)
  const result = plans.map((plan) => {
    const history = plan.prices.map((price) => ({
      id: price.id,
      amount: price.amount / 100,
      setup: price.setupFee / 100,
      createdAt: formatDate(price.createdAt),
      status: price.status.toLowerCase(), // 'active', 'legacy', 'grandfathered'
      subscribers: price.subscriptions.length,
    }));

    // Sort history: active first, then by createdAt descending
    history.sort((a, b) => {
      if (a.status === "active" && b.status !== "active") return -1;
      if (a.status !== "active" && b.status === "active") return 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return {
      id: plan.id,
      key: planTypeToKey(plan.type),
      name: plan.name,
      accent: plan.accent,
      campaigns: plan.campaigns,
      locations: plan.locations,
      selfServe: plan.selfServe,
      history,
    };
  });

  return result;
};

// ------------------------- Create Price -----------------------------
export const createPriceService = async (
  planKey: string,
  amount: number,
  setupFee: number,
  admin: string,
) => {
  const planType = getPlanTypeFromKey(planKey);

  // Fetch the plan with its prices
  const plan = await dbClient.plan.findUnique({
    where: { type: planType },
    include: { prices: true },
  });
  if (!plan) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Plan not found");
  }

  // Convert pounds to pence if necessary
  const minorAmount = amount < 10000 ? Math.round(amount * 100) : amount;
  const minorSetupFee = setupFee < 10000 ? Math.round(setupFee * 100) : setupFee;

  // Find current active price
  const activePrice = plan.prices.find((p) => p.status === PriceStatus.ACTIVE);

  // Begin transaction
  const newPrice = await dbClient.$transaction(async (tx) => {
    // 1. Set all active prices to LEGACY (if any)
    if (activePrice) {
      await tx.planPrice.updateMany({
        where: {
          planId: plan.id,
          status: PriceStatus.ACTIVE,
        },
        data: { status: PriceStatus.LEGACY },
      });
    }

    // 2. Create new active price
    const created = await tx.planPrice.create({
      data: {
        stripePriceId: `price_${planKey.toLowerCase()}_${Date.now()}`,
        planId: plan.id,
        amount: minorAmount,
        setupFee: minorSetupFee,
        status: PriceStatus.ACTIVE,
      },
    });

    // 3. Create audit log entry
    await tx.planAuditLog.create({
      data: {
        admin,
        action: AuditAction.PRICE_CREATED,
        planId: plan.id,
        previous: activePrice ? `${gbp(activePrice.amount)}/mo` : "—",
        next: `${gbp(minorAmount)}/mo`,
        affected: "New sign-ups only",
      },
    });

    return created;
  });

  return {
    ...newPrice,
    amount: newPrice.amount / 100,
    setup: newPrice.setupFee / 100,
  };
};

// ------------------------- Migrate Subscribers ------------------------
export const migrateSubscribersService = async (
  planKey: string,
  priceId: string, // legacy price id
  mode: "migrate" | "grandfather",
  admin: string,
) => {
  const planType = getPlanTypeFromKey(planKey);

  const plan = await dbClient.plan.findUnique({
    where: { type: planType },
    include: {
      prices: {
        include: {
          subscriptions: true,
        },
      },
    },
  });
  if (!plan) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Plan not found");
  }

  const legacyPrice = plan.prices.find((p) => p.id === priceId);
  if (!legacyPrice) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Price not found");
  }

  // For 'migrate', we need an active price to move subscribers to
  let activePrice = plan.prices.find((p) => p.status === PriceStatus.ACTIVE);
  if (mode === "migrate" && !activePrice) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      "No active price to migrate to",
    );
  }

  // Begin transaction
  const result = await dbClient.$transaction(async (tx) => {
    let affectedCount = 0;
    let message = "";

    if (mode === "migrate") {
      // Update all subscriptions from legacy price to active price
      const updateResult = await tx.clinicSubscription.updateMany({
        where: { planPriceId: legacyPrice.id },
        data: {
          planPriceId: activePrice!.id,
          monthlyFee: activePrice!.amount / 100,
          setupFee: activePrice!.setupFee / 100,
        },
      });
      affectedCount = updateResult.count;

      // Set legacy price status to LEGACY
      await tx.planPrice.update({
        where: { id: legacyPrice.id },
        data: { status: PriceStatus.LEGACY },
      });

      message = `Migrated ${affectedCount} subscriber(s) to ${gbp(activePrice!.amount)}/mo`;
    } else {
      // Grandfather: set price status to GRANDFATHERED
      await tx.planPrice.update({
        where: { id: legacyPrice.id },
        data: { status: PriceStatus.GRANDFATHERED },
      });
      affectedCount = legacyPrice.subscriptions.length;
      message = `Grandfathered ${affectedCount} subscriber(s) at ${gbp(legacyPrice.amount)}/mo`;
    }

    // Create audit log
    await tx.planAuditLog.create({
      data: {
        admin,
        action:
          mode === "migrate"
            ? AuditAction.SUBSCRIBERS_MIGRATED
            : AuditAction.PRICE_GRANDFATHERED,
        planId: plan.id,
        previous: `${gbp(legacyPrice.amount)}/mo`,
        next:
          mode === "migrate"
            ? `${gbp(activePrice!.amount)}/mo`
            : `${gbp(legacyPrice.amount)}/mo (locked)`,
        affected: `${affectedCount} subscriber(s)`,
      },
    });

    return { message, affectedCount };
  });

  return result;
};

// ------------------------- Overrides --------------------------------
export const getOverridesService = async () => {
  const overrides = await dbClient.clinicOverride.findMany({
    include: {
      clinic: true,
      plan: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return overrides.map((ov) => ({
    id: ov.id,
    clinic: ov.clinic.name || "Unnamed Clinic",
    clinicId: ov.clinicId,
    tier: planTypeToKey(ov.plan.type),
    tierName: ov.plan.name,
    standardPrice: ov.standardPrice / 100,
    overridePrice: ov.overridePrice / 100,
    reason: ov.reason,
  }));
};

export const createOverrideService = async (
  clinicName: string,
  planKey: string,
  overridePrice: number,
  reason: string,
  admin: string,
) => {
  const planType = getPlanTypeFromKey(planKey);

  // Find or create clinic
  let clinic = await dbClient.clinic.findFirst({
    where: { name: clinicName },
  });
  if (!clinic) {
    clinic = await dbClient.clinic.create({
      data: { name: clinicName },
    });
  }

  const plan = await dbClient.plan.findUnique({
    where: { type: planType },
    include: {
      prices: {
        where: { status: PriceStatus.ACTIVE },
      },
    },
  });
  if (!plan) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Plan not found");
  }
  const activePrice = plan.prices[0];
  if (!activePrice) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      "No active price for this plan",
    );
  }

  const minorOverridePrice = overridePrice < 10000 ? Math.round(overridePrice * 100) : overridePrice;

  // Create override
  const override = await dbClient.$transaction(async (tx) => {
    const ov = await tx.clinicOverride.create({
      data: {
        clinicId: clinic!.id,
        planId: plan.id,
        standardPrice: activePrice.amount,
        overridePrice: minorOverridePrice,
        reason,
        createdById: admin,
      },
    });

    // Audit log
    await tx.planAuditLog.create({
      data: {
        admin,
        action: AuditAction.OVERRIDE_APPLIED,
        planId: plan.id,
        previous: `${gbp(activePrice.amount)}/mo`,
        next: `${gbp(minorOverridePrice)}/mo`,
        affected: clinic!.name || "Clinic",
      },
    });

    return ov;
  });

  return {
    ...override,
    standardPrice: override.standardPrice / 100,
    overridePrice: override.overridePrice / 100,
  };
};

export const deleteOverrideService = async (overrideId: string, admin: string) => {
  const override = await dbClient.clinicOverride.findUnique({
    where: { id: overrideId },
    include: { clinic: true, plan: true },
  });
  if (!override) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Override not found");
  }

  await dbClient.$transaction(async (tx) => {
    await tx.clinicOverride.delete({
      where: { id: overrideId },
    });

    await tx.planAuditLog.create({
      data: {
        admin,
        action: AuditAction.OVERRIDE_REMOVED,
        planId: override.planId,
        previous: `${gbp(override.overridePrice)}/mo`,
        next: `${gbp(override.standardPrice)}/mo`,
        affected: override.clinic.name || "Clinic",
      },
    });
  });

  return { message: "Override removed successfully" };
};

// ------------------------- Audit Log --------------------------------
export const getAuditLogService = async () => {
  const entries = await dbClient.planAuditLog.findMany({
    include: {
      plan: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const actionLabels: Record<AuditAction, string> = {
    PRICE_CREATED: "New price created",
    PRICE_UPDATED: "Price updated",
    SUBSCRIBERS_MIGRATED: "Subscribers migrated",
    PRICE_GRANDFATHERED: "Price grandfathered",
    OVERRIDE_APPLIED: "Per-clinic override applied",
    OVERRIDE_REMOVED: "Per-clinic override removed",
  };

  return entries.map((entry) => ({
    id: entry.id,
    admin: entry.admin,
    action: actionLabels[entry.action] || entry.action,
    tier: entry.plan.name,
    previous: entry.previous,
    next: entry.next,
    affected: entry.affected,
    timestamp: entry.createdAt
      .toLocaleString("en-GB", { hour12: false })
      .replace(",", ""),
  }));
};
