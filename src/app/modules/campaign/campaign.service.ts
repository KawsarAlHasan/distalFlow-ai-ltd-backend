import { StatusCodes } from "http-status-codes";
import ApiError from "../../../errors/ApiError";
import { dbClient } from "../../../lib/prisma";

// -----------------------------------------------------------------------------
// Type Definitions
// -----------------------------------------------------------------------------
export interface ICreateTestimonial {
  name: string;
  detail?: string;
  quote: string;
  rating?: number;
  highlight?: boolean;
  order?: number;
}

export interface ICreateStep {
  stepNumber?: number;
  title: string;
  description: string;
  order?: number;
}

export interface ICreateFaq {
  question: string;
  answer: string;
  order?: number;
}

export interface ICreateCampaignPayload {
  clinicId: string;

  // Header / Navbar
  logoUrl?: string;
  navPhone?: string;
  navWhatsapp?: string;
  navCtaText?: string;

  // 1. Hero Section (Required)
  name: string;
  heroBadge?: string;
  headline?: string;
  subheadline?: string;
  bodyCopy?: string;
  rating?: number;
  patientCount?: number;
  cta?: string;
  whatsappCta?: string;
  heroHighlights?: string[];

  // Hero Form
  formBadge?: string;
  formTitle?: string;
  formSubtitle?: string;
  formButtonText?: string;
  formCallbackText?: string;
  formGuarantees?: string[];
  treatmentOptions?: string[];
  lockedTreatment?: string | null;
  hideTreatmentSelect?: boolean;
  clinicLocations?: string[];

  // Voice AI
  aiGreeting?: string;

  // 2. Video Section (Optional)
  showVideoSection?: boolean;
  videoLabel?: string;
  videoTitle?: string;
  videoSubtitle?: string;
  videoUrl?: string;
  videoPosterUrl?: string;
  consent?: boolean;
  sourceVideoUrl?: string;
  sourceVideoName?: string;
  sourceVideoSize?: number;
  videoScript?: string;
  generatedVideoUrl?: string;
  videoApproved?: boolean;

  // 3. Doctor Section (Optional)
  showDoctorSection?: boolean;
  doctorBadge?: string;
  doctorName?: string;
  doctorTitle?: string;
  doctorQualification?: string;
  doctorImageUrl?: string;
  doctorBadgeTitle?: string;
  doctorBadgeSubtitle?: string;
  doctorDescription?: string;
  doctorCredentials?: string[];

  // 4. Testimonials Section (Optional)
  showTestimonialsSection?: boolean;
  testimonialBadge?: string;
  testimonialTitle?: string;
  testimonialRating?: number;
  testimonialReviewCount?: number;
  testimonials?: ICreateTestimonial[];

  // 5. How It Works Section (Optional)
  showHowItWorksSection?: boolean;
  howItWorksBadge?: string;
  howItWorksTitle?: string;
  howItWorksSubtitle?: string;
  howItWorksSteps?: ICreateStep[];
  steps?: ICreateStep[];

  // 6. FAQ Section (Optional)
  showFaqSection?: boolean;
  faqBadge?: string;
  faqTitle?: string;
  faqSubtitle?: string;
  faqPhone?: string;
  faqs?: ICreateFaq[];

  // 7. Secondary CTA Section (Optional)
  showSecondaryCtaSection?: boolean;
  secondaryCtaBadge?: string;
  secondaryCtaTitle?: string;
  secondaryCtaSubtitle?: string;
  secondaryCtaButtonText?: string;
  secondaryCtaPhone?: string;
  secondaryCtaWhatsapp?: string;
  secondaryCtaConcerns?: string[];

  // 8. Footer Section (Optional)
  showFooterSection?: boolean;
  footerClinicName?: string;
  footerText?: string;
}

// -----------------------------------------------------------------------------
// Create Campaign Service
// -----------------------------------------------------------------------------
export const createCampaignsService = async (payload: ICreateCampaignPayload) => {
  const {
    clinicId,
    // Header
    logoUrl,
    navPhone,
    navWhatsapp,
    navCtaText,

    // Hero Section
    name,
    heroBadge,
    headline,
    subheadline,
    bodyCopy,
    rating,
    patientCount,
    cta,
    whatsappCta,
    heroHighlights,
    formBadge,
    formTitle,
    formSubtitle,
    formButtonText,
    formCallbackText,
    formGuarantees,
    treatmentOptions,
    lockedTreatment,
    hideTreatmentSelect,
    clinicLocations,
    aiGreeting,

    // Video Section
    showVideoSection,
    videoLabel,
    videoTitle,
    videoSubtitle,
    videoUrl,
    videoPosterUrl,
    consent,
    sourceVideoUrl,
    sourceVideoName,
    sourceVideoSize,
    videoScript,
    generatedVideoUrl,
    videoApproved,

    // Doctor Section
    showDoctorSection,
    doctorBadge,
    doctorName,
    doctorTitle,
    doctorQualification,
    doctorImageUrl,
    doctorBadgeTitle,
    doctorBadgeSubtitle,
    doctorDescription,
    doctorCredentials,

    // Testimonials Section
    showTestimonialsSection,
    testimonialBadge,
    testimonialTitle,
    testimonialRating,
    testimonialReviewCount,
    testimonials,

    // How It Works Section
    showHowItWorksSection,
    howItWorksBadge,
    howItWorksTitle,
    howItWorksSubtitle,
    howItWorksSteps,
    steps,

    // FAQ Section
    showFaqSection,
    faqBadge,
    faqTitle,
    faqSubtitle,
    faqPhone,
    faqs,

    // Secondary CTA Section
    showSecondaryCtaSection,
    secondaryCtaBadge,
    secondaryCtaTitle,
    secondaryCtaSubtitle,
    secondaryCtaButtonText,
    secondaryCtaPhone,
    secondaryCtaWhatsapp,
    secondaryCtaConcerns,

    // Footer Section
    showFooterSection,
    footerClinicName,
    footerText,
  } = payload;

  // 1. Verify Clinic
  if (!clinicId) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Clinic ID is required!");
  }

  const clinic = await dbClient.clinic.findUnique({
    where: { id: clinicId },
    select: { id: true, name: true, city: true },
  });

  if (!clinic) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Clinic not found!");
  }

  // 2. Prepare relational data
  const normalizedSteps = howItWorksSteps || steps;

  const testimonialsCreate =
    Array.isArray(testimonials) && testimonials.length > 0
      ? {
          create: testimonials.map((item, index) => ({
            name: item.name,
            detail: item.detail ?? null,
            quote: item.quote,
            rating: typeof item.rating === "number" ? item.rating : 5.0,
            highlight: Boolean(item.highlight),
            order: item.order ?? index,
          })),
        }
      : undefined;

  const stepsCreate =
    Array.isArray(normalizedSteps) && normalizedSteps.length > 0
      ? {
          create: normalizedSteps.map((item, index) => ({
            stepNumber: item.stepNumber ?? index + 1,
            title: item.title,
            description: item.description,
            order: item.order ?? index,
          })),
        }
      : undefined;

  const faqsCreate =
    Array.isArray(faqs) && faqs.length > 0
      ? {
          create: faqs.map((item, index) => ({
            question: item.question,
            answer: item.answer,
            order: item.order ?? index,
          })),
        }
      : undefined;

  // 3. Create Campaign with all sections and relations
  const campaign = await dbClient.campaign.create({
    data: {
      clinicId,

      // Top Navbar / Header Info
      ...(logoUrl !== undefined && { logoUrl }),
      ...(navPhone !== undefined && { navPhone }),
      ...(navWhatsapp !== undefined && { navWhatsapp }),
      ...(navCtaText !== undefined && { navCtaText }),

      // 1. HERO SECTION (REQUIRED)
      name,
      ...(heroBadge !== undefined && { heroBadge }),
      ...(headline !== undefined && { headline }),
      ...(subheadline !== undefined && { subheadline }),
      ...(bodyCopy !== undefined && { bodyCopy }),
      ...(rating !== undefined && { rating }),
      ...(patientCount !== undefined && { patientCount }),
      ...(cta !== undefined && { cta }),
      ...(whatsappCta !== undefined && { whatsappCta }),
      ...(heroHighlights !== undefined && { heroHighlights }),

      // Hero Form Card (REQUIRED)
      ...(formBadge !== undefined && { formBadge }),
      ...(formTitle !== undefined && { formTitle }),
      ...(formSubtitle !== undefined && { formSubtitle }),
      ...(formButtonText !== undefined && { formButtonText }),
      ...(formCallbackText !== undefined && { formCallbackText }),
      ...(formGuarantees !== undefined && { formGuarantees }),
      ...(treatmentOptions !== undefined && { treatmentOptions }),
      ...(lockedTreatment !== undefined && { lockedTreatment }),
      ...(hideTreatmentSelect !== undefined && { hideTreatmentSelect }),
      ...(clinicLocations !== undefined && { clinicLocations }),
      ...(aiGreeting !== undefined && { aiGreeting }),

      // 2. VIDEO SECTION (OPTIONAL)
      ...(showVideoSection !== undefined && { showVideoSection }),
      ...(videoLabel !== undefined && { videoLabel }),
      ...(videoTitle !== undefined && { videoTitle }),
      ...(videoSubtitle !== undefined && { videoSubtitle }),
      ...(videoUrl !== undefined && { videoUrl }),
      ...(videoPosterUrl !== undefined && { videoPosterUrl }),
      ...(consent !== undefined && { consent }),
      ...(sourceVideoUrl !== undefined && { sourceVideoUrl }),
      ...(sourceVideoName !== undefined && { sourceVideoName }),
      ...(sourceVideoSize !== undefined && { sourceVideoSize }),
      ...(videoScript !== undefined && { videoScript }),
      ...(generatedVideoUrl !== undefined && { generatedVideoUrl }),
      ...(videoApproved !== undefined && { videoApproved }),

      // 3. DOCTOR SECTION (OPTIONAL)
      ...(showDoctorSection !== undefined && { showDoctorSection }),
      ...(doctorBadge !== undefined && { doctorBadge }),
      ...(doctorName !== undefined && { doctorName }),
      ...(doctorTitle !== undefined && { doctorTitle }),
      ...(doctorQualification !== undefined && { doctorQualification }),
      ...(doctorImageUrl !== undefined && { doctorImageUrl }),
      ...(doctorBadgeTitle !== undefined && { doctorBadgeTitle }),
      ...(doctorBadgeSubtitle !== undefined && { doctorBadgeSubtitle }),
      ...(doctorDescription !== undefined && { doctorDescription }),
      ...(doctorCredentials !== undefined && { doctorCredentials }),

      // 4. PATIENT TESTIMONIALS SECTION (OPTIONAL)
      ...(showTestimonialsSection !== undefined && { showTestimonialsSection }),
      ...(testimonialBadge !== undefined && { testimonialBadge }),
      ...(testimonialTitle !== undefined && { testimonialTitle }),
      ...(testimonialRating !== undefined && { testimonialRating }),
      ...(testimonialReviewCount !== undefined && { testimonialReviewCount }),
      testimonials: testimonialsCreate,

      // 5. HOW IT WORKS SECTION (OPTIONAL)
      ...(showHowItWorksSection !== undefined && { showHowItWorksSection }),
      ...(howItWorksBadge !== undefined && { howItWorksBadge }),
      ...(howItWorksTitle !== undefined && { howItWorksTitle }),
      ...(howItWorksSubtitle !== undefined && { howItWorksSubtitle }),
      howItWorksSteps: stepsCreate,

      // 6. TREATMENT FAQ SECTION (OPTIONAL)
      ...(showFaqSection !== undefined && { showFaqSection }),
      ...(faqBadge !== undefined && { faqBadge }),
      ...(faqTitle !== undefined && { faqTitle }),
      ...(faqSubtitle !== undefined && { faqSubtitle }),
      ...(faqPhone !== undefined && { faqPhone }),
      faqs: faqsCreate,

      // 7. SECONDARY CTA SECTION (OPTIONAL)
      ...(showSecondaryCtaSection !== undefined && { showSecondaryCtaSection }),
      ...(secondaryCtaBadge !== undefined && { secondaryCtaBadge }),
      ...(secondaryCtaTitle !== undefined && { secondaryCtaTitle }),
      ...(secondaryCtaSubtitle !== undefined && { secondaryCtaSubtitle }),
      ...(secondaryCtaButtonText !== undefined && { secondaryCtaButtonText }),
      ...(secondaryCtaPhone !== undefined && { secondaryCtaPhone }),
      ...(secondaryCtaWhatsapp !== undefined && { secondaryCtaWhatsapp }),
      ...(secondaryCtaConcerns !== undefined && { secondaryCtaConcerns }),

      // 8. FOOTER SECTION (OPTIONAL)
      ...(showFooterSection !== undefined && { showFooterSection }),
      ...(footerClinicName !== undefined && { footerClinicName }),
      ...(footerText !== undefined && { footerText }),
    },
    include: {
      testimonials: {
        orderBy: { order: "asc" },
      },
      howItWorksSteps: {
        orderBy: { order: "asc" },
      },
      faqs: {
        orderBy: { order: "asc" },
      },
      clinic: {
        select: {
          id: true,
          name: true,
          city: true,
        },
      },
    },
  });

  return campaign;
};

// -----------------------------------------------------------------------------
// Get All Campaigns by Clinic
// -----------------------------------------------------------------------------
export const getAllCampaignsService = async (clinicId: string) => {
  const campaigns = await dbClient.campaign.findMany({
    where: { clinicId },
    include: {
      testimonials: { orderBy: { order: "asc" } },
      howItWorksSteps: { orderBy: { order: "asc" } },
      faqs: { orderBy: { order: "asc" } },
    },
    orderBy: { createdAt: "desc" },
  });

  return campaigns;
};

// -----------------------------------------------------------------------------
// Get Campaign By ID (or Slug)
// -----------------------------------------------------------------------------
export const getCampaignByIdService = async (id: string) => {
  const campaign = await dbClient.campaign.findUnique({
    where: { id },
    include: {
      testimonials: { orderBy: { order: "asc" } },
      howItWorksSteps: { orderBy: { order: "asc" } },
      faqs: { orderBy: { order: "asc" } },
      clinic: { select: { id: true, name: true, city: true } },
    },
  });

  if (!campaign) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Campaign not found!");
  }

  return campaign;
};
