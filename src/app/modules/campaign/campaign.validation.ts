import { z } from "zod";

// -----------------------------------------------------------------------------
// Sub-schemas for Relational Sections
// -----------------------------------------------------------------------------
const testimonialZodSchema = z.object({
  name: z.string().min(1, "Name is required"),
  detail: z.string().optional(),
  quote: z.string().min(1, "Quote is required"),
  rating: z.coerce.number().min(0).max(5).optional(),
  highlight: z.coerce.boolean().optional(),
  order: z.coerce.number().int().optional(),
});

const stepZodSchema = z.object({
  stepNumber: z.coerce.number().int().positive().optional(),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  order: z.coerce.number().int().optional(),
});

const faqZodSchema = z.object({
  question: z.string().min(1, "Question is required"),
  answer: z.string().min(1, "Answer is required"),
  order: z.coerce.number().int().optional(),
});

// -----------------------------------------------------------------------------
// Main Create Campaign Validation Schema
// -----------------------------------------------------------------------------
export const createCampaignZod = z.object({
  body: z.object({
    // -------------------------------------------------------------------------
    // Top Navbar / Header Info (Optional)
    // -------------------------------------------------------------------------
    logoUrl: z.string().optional(),
    navPhone: z.string().optional(),
    navWhatsapp: z.string().optional(),
    navCtaText: z.string().optional(),

    // -------------------------------------------------------------------------
    // 1. HERO SECTION (REQUIRED)
    // -------------------------------------------------------------------------
    name: z.string().min(2, "Campaign name must be at least 2 characters"),
    heroBadge: z.string().optional(),
    headline: z.string().optional(),
    subheadline: z.string().optional(),
    bodyCopy: z.string().optional(),
    rating: z.coerce.number().min(0).max(5).optional(),
    patientCount: z.coerce.number().int().nonnegative().optional(),
    cta: z.string().optional(),
    whatsappCta: z.string().optional(),
    heroHighlights: z.array(z.string()).optional(),

    // Hero Consultation Form Card (REQUIRED)
    formBadge: z.string().optional(),
    formTitle: z.string().optional(),
    formSubtitle: z.string().optional(),
    formButtonText: z.string().optional(),
    formCallbackText: z.string().optional(),
    formGuarantees: z.array(z.string()).optional(),
    treatmentOptions: z.array(z.string()).optional(),
    lockedTreatment: z.string().nullable().optional(),
    hideTreatmentSelect: z.coerce.boolean().optional(),
    clinicLocations: z.array(z.string()).optional(),

    // Voice AI greeting
    aiGreeting: z.string().optional(),

    // -------------------------------------------------------------------------
    // 2. VIDEO SECTION (OPTIONAL)
    // -------------------------------------------------------------------------
    showVideoSection: z.coerce.boolean().optional(),
    videoLabel: z.string().optional(),
    videoTitle: z.string().optional(),
    videoSubtitle: z.string().optional(),
    videoUrl: z.string().optional(),
    videoPosterUrl: z.string().optional(),

    // AI Avatar Video Generator fields (Optional)
    consent: z.coerce.boolean().optional(),
    sourceVideoUrl: z.string().optional(),
    sourceVideoName: z.string().optional(),
    sourceVideoSize: z.coerce.number().int().optional(),
    videoScript: z.string().optional(),
    generatedVideoUrl: z.string().optional(),
    videoApproved: z.coerce.boolean().optional(),

    // -------------------------------------------------------------------------
    // 3. DOCTOR SECTION (OPTIONAL)
    // -------------------------------------------------------------------------
    showDoctorSection: z.coerce.boolean().optional(),
    doctorBadge: z.string().optional(),
    doctorName: z.string().optional(),
    doctorTitle: z.string().optional(),
    doctorQualification: z.string().optional(),
    doctorImageUrl: z.string().optional(),
    doctorBadgeTitle: z.string().optional(),
    doctorBadgeSubtitle: z.string().optional(),
    doctorDescription: z.string().optional(),
    doctorCredentials: z.array(z.string()).optional(),

    // -------------------------------------------------------------------------
    // 4. PATIENT TESTIMONIALS SECTION (OPTIONAL)
    // -------------------------------------------------------------------------
    showTestimonialsSection: z.coerce.boolean().optional(),
    testimonialBadge: z.string().optional(),
    testimonialTitle: z.string().optional(),
    testimonialRating: z.coerce.number().optional(),
    testimonialReviewCount: z.coerce.number().int().optional(),
    testimonials: z.array(testimonialZodSchema).optional(),

    // -------------------------------------------------------------------------
    // 5. HOW IT WORKS SECTION (OPTIONAL)
    // -------------------------------------------------------------------------
    showHowItWorksSection: z.coerce.boolean().optional(),
    howItWorksBadge: z.string().optional(),
    howItWorksTitle: z.string().optional(),
    howItWorksSubtitle: z.string().optional(),
    howItWorksSteps: z.array(stepZodSchema).optional(),
    steps: z.array(stepZodSchema).optional(),

    // -------------------------------------------------------------------------
    // 6. TREATMENT FAQ SECTION (OPTIONAL)
    // -------------------------------------------------------------------------
    showFaqSection: z.coerce.boolean().optional(),
    faqBadge: z.string().optional(),
    faqTitle: z.string().optional(),
    faqSubtitle: z.string().optional(),
    faqPhone: z.string().optional(),
    faqs: z.array(faqZodSchema).optional(),

    // -------------------------------------------------------------------------
    // 7. SECONDARY CTA SECTION (OPTIONAL)
    // -------------------------------------------------------------------------
    showSecondaryCtaSection: z.coerce.boolean().optional(),
    secondaryCtaBadge: z.string().optional(),
    secondaryCtaTitle: z.string().optional(),
    secondaryCtaSubtitle: z.string().optional(),
    secondaryCtaButtonText: z.string().optional(),
    secondaryCtaPhone: z.string().optional(),
    secondaryCtaWhatsapp: z.string().optional(),
    secondaryCtaConcerns: z.array(z.string()).optional(),

    // -------------------------------------------------------------------------
    // 8. FOOTER SECTION (OPTIONAL)
    // -------------------------------------------------------------------------
    showFooterSection: z.coerce.boolean().optional(),
    footerClinicName: z.string().optional(),
    footerText: z.string().optional(),
  }),
});
