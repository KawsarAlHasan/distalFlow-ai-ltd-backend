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
