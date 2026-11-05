// src/services/clinic.service.ts
import { StatusCodes } from "http-status-codes";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { dbClient } from "../../../lib/prisma";
import ApiError from "../../../errors/ApiError";
import { stripe } from "../../../config/stripe";
import config from "../../../config";
import { generateOnetimePassword } from "../../../util/password";
import {
  clinicOnboardingEmail,
  paymentConfirmationEmail,
} from "../../../shared/emailTemplate";
import { emailHelper } from "../../../helpers/emailHelper";

// Types
interface ClinicCreatePayload {
  name: string;
  tradingCompany?: string;
  city?: string;
  locations: number;
  clinicPostCode: Array<{
    code: string;
    unavailable?: boolean;
    override?: boolean;
  }>;
  planId: string;
  numberOfLocations: number;
  adminName: string;
  adminEmail: string;
  lat?: string;
  lng?: string;
  discount?: string;
  promoCode?: string;
}

interface ClinicOnboardingResponse {
  clinicId: string;
  adminId: string;
  checkoutUrl: string;
  temporaryPassword: string;
}

export const clinicCreateService = async (
  payload: ClinicCreatePayload,
): Promise<ClinicOnboardingResponse> => {
  const {
    name,
    tradingCompany,
    city,
    locations,
    clinicPostCode,
    planId,
    numberOfLocations,
    adminName,
    adminEmail,
    lat,
    lng,
    discount = "none",
    promoCode = "",
  } = payload;

  const plan = await dbClient.plan.findUnique({
    where: { id: planId },
    include: {
      prices: {
        where: { status: "ACTIVE" },
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
  });

  if (!plan) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid plan selected.");
  }

  const activePrice = plan.prices[0];
  if (!activePrice) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      "No active price found for this plan.",
    );
  }

  const isMultiLocationAllowed = plan.type === "ENTERPRISE";
  if (numberOfLocations > 1 && !isMultiLocationAllowed) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      "Only Enterprise plan supports multiple locations.",
    );
  }

  const pricing = calculatePricing(
    plan,
    activePrice,
    numberOfLocations,
    discount,
  );

  const temporaryPassword = generateOnetimePassword();
  const hashedPassword = await bcrypt.hash(temporaryPassword, 12);

  const result = await dbClient.$transaction(async (tx) => {
    const existingAdmin = await tx.clinicAdmin.findUnique({
      where: { email: adminEmail },
    });

    // check if email already exists
    if (existingAdmin && existingAdmin.isVerified === true) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Email already exists!");
    }

    // check if email already exists
    if (existingAdmin && existingAdmin.isVerified === false) {
      await dbClient.clinicAdmin.deleteMany({
        where: {
          email: adminEmail,
        },
      });
    }

    const clinic = await tx.clinic.create({
      data: {
        name,
        tradingCompany,
        city,
        status: "PENDING",
        admin: {
          create: {
            name: adminName,
            email: adminEmail,
            password: hashedPassword,
            onTimePassword: false,
            isMainAdmin: true,
            isVerified: false,
          },
        },
        postcodes: {
          create: clinicPostCode.map((pc) => ({
            code: pc.code.toUpperCase(),
            unavailable: pc.unavailable || false,
            override: pc.override || false,
          })),
        },
        location:
          lat && lng
            ? {
              create: { lat, lng },
            }
            : undefined,
        subscription: {
          create: {
            plan: plan.type,
            locations: numberOfLocations,
            discount,
            promoCode,
            monthlyFee: pricing.monthly,
            setupFee: pricing.setup,
            status: "pending",
          },
        },
      },
      include: {
        admin: true,
        subscription: true,
      },
    });

    return clinic;
  });

  let checkoutUrl: string = "";
  if (plan.selfServe) {
    const session = await createStripeCheckoutSession(
      result,
      pricing,
      adminEmail,
      adminName,
      plan,
    );
    checkoutUrl = session.url || "";
  }

  const emailValues = {
    email: adminEmail,
    adminName,
    temporaryPassword,
    checkoutUrl,
    clinicName: result.name || "New Clinic",
    isSelfServe: plan.selfServe,
    frontendBaseUrl: config.FRONTEND_BASE_URL,
  };
  const clinicOnboarding = clinicOnboardingEmail(emailValues);
  await emailHelper(clinicOnboarding);

  return {
    clinicId: result.id,
    adminId: result.admin?.id || "",
    checkoutUrl,
    temporaryPassword,
  };
};

// Calculate pricing based on plan and locations
function calculatePricing(
  plan: any,
  activePrice: any,
  numberOfLocations: number,
  discount: string,
) {
  let monthly = activePrice.amount / 100; // Convert from cents/pence
  let setup = activePrice.setupFee / 100;

  // Enterprise pricing with additional locations
  if (plan.type === "ENTERPRISE") {
    const baseLocations = 2;
    const extraLocations = Math.max(0, numberOfLocations - baseLocations);

    if (plan.additionalSiteAmount) {
      monthly += extraLocations * (plan.additionalSiteAmount / 100);
    }
    if (plan.additionalSiteSetup) {
      setup += extraLocations * (plan.additionalSiteSetup / 100);
    }
  }

  // Apply discount
  const discountPct = discount === "none" ? 0 : Number(discount);
  if (discountPct > 0) {
    monthly = monthly * (1 - discountPct / 100);
  }

  return { monthly, setup };
}

// Create Stripe checkout session
async function createStripeCheckoutSession(
  clinic: any,
  pricing: any,
  adminEmail: string,
  adminName: string,
  plan: any,
) {
  const firstChargeExVat = pricing.monthly + pricing.setup;
  const firstChargeIncVat = firstChargeExVat * 1.2; // 20% VAT

  return await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    customer_email: adminEmail,
    line_items: [
      {
        price_data: {
          currency: "gbp",
          product_data: {
            name: `${plan.name} - Clinic Onboarding`,
            description: `First month subscription (${pricing.monthly.toFixed(2)} GBP) + Setup fee (${pricing.setup.toFixed(2)} GBP)`,
          },
          unit_amount: Math.round(firstChargeIncVat * 100), // Convert to pence
        },
        quantity: 1,
      },
    ],
    metadata: {
      type: "subscription",
      clinicId: clinic.id,
      planId: plan.id,
      planName: plan.name,
      subscriptionId: clinic.subscription?.id || "",
      adminEmail: adminEmail,
      adminName: adminName,
      clinicName: clinic.name || "New Clinic",
    },
    success_url: `${config.FRONTEND_BASE_URL}/login`,
    cancel_url: `${config.FRONTEND_BASE_URL}/onboarding/cancel?clinicId=${clinic.id}`,
    payment_intent_data: {
      metadata: {
        clinicId: clinic.id,
        type: "onboarding",
      },
    },
  });
}

// Get clinic onboarding status
export const getOnboardingStatusService = async (clinicId: string) => {
  const clinic = await dbClient.clinic.findUnique({
    where: { id: clinicId },
    include: {
      admin: {
        select: {
          email: true,
          isVerified: true,
          onTimePassword: true,
        },
      },
      subscription: {
        select: {
          status: true,
          plan: true,
          locations: true,
        },
      },
    },
  });

  if (!clinic) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Clinic not found.");
  }

  return {
    clinicId: clinic.id,
    status: clinic.status,
    adminVerified: clinic.admin?.isVerified || false,
    subscriptionStatus: clinic.subscription?.status || "pending",
    plan: clinic.subscription?.plan,
    hasTemporaryPassword: !!clinic.admin?.onTimePassword,
  };
};


// ---------------------------------------------------------------------------
// ADMIN CLINIC SERVICES (List, Search, Filter, Details, Status)
// ---------------------------------------------------------------------------

export const getAllClinicsService = async (query: Record<string, any>) => {
  const {
    search,
    status = "All",
    page = 1,
    limit = 20,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = query;

  const pageNum = Math.max(1, Number(page) || 1);
  const limitNum = Math.max(1, Number(limit) || 20);
  const skip = (pageNum - 1) * limitNum;

  // Search filter
  const searchFilter: any = search
    ? {
        OR: [
          { name: { contains: String(search), mode: "insensitive" } },
          { tradingCompany: { contains: String(search), mode: "insensitive" } },
          { city: { contains: String(search), mode: "insensitive" } },
          { billingEmail: { contains: String(search), mode: "insensitive" } },
          { admin: { name: { contains: String(search), mode: "insensitive" } } },
          { admin: { email: { contains: String(search), mode: "insensitive" } } },
          { postcodes: { some: { code: { contains: String(search), mode: "insensitive" } } } },
        ],
      }
    : {};

  // Status tab filter
  let statusFilter: any = {};
  if (status && status !== "All") {
    if (status === "Active") {
      statusFilter = {
        status: "ACTIVE",
        OR: [
          { subscription: null },
          { subscription: { status: "active" } },
        ],
      };
    } else if (status === "Grace") {
      statusFilter = {
        subscription: {
          status: { in: ["grace", "failed", "past_due"] },
        },
      };
    } else if (status === "Onboarding") {
      statusFilter = {
        OR: [
          { status: "PENDING" },
          { subscription: { status: "pending" } },
        ],
      };
    } else if (status === "Suspended") {
      statusFilter = {
        status: { in: ["SUSPENDED", "INACTIVE"] },
      };
    }
  }

  const where = {
    ...searchFilter,
    ...statusFilter,
  };

  const [total, clinics, totalAll, activeCount, graceCount, onboardingCount, suspendedCount] =
    await Promise.all([
      dbClient.clinic.count({ where }),
      dbClient.clinic.findMany({
        where,
        include: {
          admin: {
            select: {
              id: true,
              name: true,
              email: true,
              isVerified: true,
              status: true,
              onTimePassword: true,
              createdAt: true,
            },
          },
          subscription: {
            include: {
              planPrice: {
                include: {
                  plan: true,
                },
              },
            },
          },
          postcodes: true,
          location: true,
          legalAcceptances: {
            include: {
              termsDocument: true,
              privacyDocument: true,
            },
            orderBy: { acceptedAt: "desc" },
            take: 1,
          },
          _count: {
            select: {
              campaigns: true,
              invoices: true,
            },
          },
        },
        orderBy: { [sortBy]: sortOrder },
        skip,
        take: limitNum,
      }),
      dbClient.clinic.count(),
      dbClient.clinic.count({
        where: {
          status: "ACTIVE",
          OR: [{ subscription: null }, { subscription: { status: "active" } }],
        },
      }),
      dbClient.clinic.count({
        where: {
          subscription: { status: { in: ["grace", "failed", "past_due"] } },
        },
      }),
      dbClient.clinic.count({
        where: {
          OR: [{ status: "PENDING" }, { subscription: { status: "pending" } }],
        },
      }),
      dbClient.clinic.count({
        where: { status: { in: ["SUSPENDED", "INACTIVE"] } },
      }),
    ]);

  const formattedClinics = clinics.map((c) => {
    let computedStatus = "Active";
    let statusGroup = "Active";

    if (c.status === "SUSPENDED" || c.status === "INACTIVE") {
      computedStatus = "Suspended";
      statusGroup = "Suspended";
    } else if (
      c.subscription?.status === "grace" ||
      c.subscription?.status === "failed" ||
      c.subscription?.status === "past_due"
    ) {
      computedStatus = "Grace";
      statusGroup = "Grace";
    } else if (c.status === "PENDING" || c.subscription?.status === "pending") {
      computedStatus = "Onboarding";
      statusGroup = "Onboarding";
    }

    const latestLegal = c.legalAcceptances?.[0];
    const postcodesJoined =
      c.postcodes.length > 0 ? c.postcodes.map((p) => p.code).join(", ") : "—";

    const joinedFormatted = new Intl.DateTimeFormat("en-GB", {
      month: "short",
      year: "numeric",
    }).format(new Date(c.createdAt));

    const fullJoinedDate = new Intl.DateTimeFormat("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date(c.createdAt));

    const monthlyFee = c.subscription?.monthlyFee || 0;
    const mrrFormatted =
      monthlyFee > 0 ? `£${Math.round(monthlyFee).toLocaleString("en-GB")}` : "£0";

    const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
      c.name || "Clinic",
    )}&background=1E0F22&color=C8A96E&rounded=true&bold=true`;

    return {
      id: c.id,
      key: c.id,
      name: c.name || "Unnamed Clinic",
      tradingCompany: c.tradingCompany || "—",
      doctor: c.admin?.name || "Dr. Administrator",
      email: c.admin?.email || c.billingEmail || "—",
      avatar: avatarUrl,
      location: c.city || "—",
      postcode: postcodesJoined,
      postcodesList: c.postcodes,
      plan: c.subscription?.plan || null,
      locationsCount: c.subscription?.locations || 1,
      leads: c._count.campaigns > 0 ? c._count.campaigns * 18 : 12,
      campaignsCount: c._count.campaigns,
      mrr: mrrFormatted,
      monthlyFee,
      setupFee: c.subscription?.setupFee || 0,
      joined: joinedFormatted,
      fullJoinedDate,
      joinedAt: c.createdAt,
      terms: latestLegal?.termsDocument?.version || null,
      privacy: latestLegal?.privacyDocument?.version || null,
      termsAcceptedAt: latestLegal?.acceptedAt || null,
      privacyAcceptedAt: latestLegal?.acceptedAt || null,
      status: computedStatus,
      statusGroup,
      rawStatus: c.status,
      billingName: c.billingName || c.name || "—",
      billingEmail: c.billingEmail || c.admin?.email || "—",
      vatNumber: c.vatNumber || "—",
      stripeCustomerId: c.stripeCustomerId || null,
      admin: c.admin,
    };
  });

  return {
    meta: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.ceil(total / limitNum),
    },
    stats: {
      totalClinics: totalAll,
      active: activeCount,
      inGrace: graceCount,
      onboarding: onboardingCount,
      suspended: suspendedCount,
    },
    clinics: formattedClinics,
  };
};

export const getClinicByIdService = async (clinicId: string) => {
  const clinic = await dbClient.clinic.findUnique({
    where: { id: clinicId },
    include: {
      admin: true,
      subscription: {
        include: {
          planPrice: {
            include: {
              plan: true,
            },
          },
        },
      },
      postcodes: true,
      location: true,
      invoices: {
        orderBy: { paymentDate: "desc" },
        take: 10,
      },
      salesRequests: {
        orderBy: { createdAt: "desc" },
        take: 5,
      },
      legalAcceptances: {
        include: {
          termsDocument: true,
          privacyDocument: true,
        },
        orderBy: { acceptedAt: "desc" },
      },
      campaigns: {
        select: {
          id: true,
          name: true,
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!clinic) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Clinic not found");
  }

  return clinic;
};

export const updateClinicStatusService = async (
  clinicId: string,
  newStatus: any,
) => {
  const clinic = await dbClient.clinic.findUnique({
    where: { id: clinicId },
    include: { admin: true },
  });

  if (!clinic) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Clinic not found");
  }

  const updatedClinic = await dbClient.$transaction(async (tx) => {
    const updated = await tx.clinic.update({
      where: { id: clinicId },
      data: { status: newStatus },
    });

    if (clinic.admin) {
      const adminStatus =
        newStatus === "SUSPENDED" || newStatus === "INACTIVE"
          ? "SUSPENDED"
          : "ACTIVE";

      await tx.clinicAdmin.update({
        where: { id: clinic.admin.id },
        data: { status: adminStatus },
      });
    }

    return updated;
  });

  return updatedClinic;
};
