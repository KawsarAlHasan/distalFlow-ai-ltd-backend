-- AlterTable
ALTER TABLE "campaigns" ADD COLUMN     "clinicLocations" TEXT[] DEFAULT ARRAY['Oxford', 'Didcot']::TEXT[],
ADD COLUMN     "doctorBadge" TEXT DEFAULT 'Your Surgeon',
ADD COLUMN     "doctorBadgeSubtitle" TEXT DEFAULT 'UCL Eastman
Dental Institute',
ADD COLUMN     "doctorBadgeTitle" TEXT DEFAULT 'PhD',
ADD COLUMN     "doctorCredentials" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "doctorTitle" TEXT,
ADD COLUMN     "faqBadge" TEXT DEFAULT 'FAQ',
ADD COLUMN     "faqPhone" TEXT,
ADD COLUMN     "faqSubtitle" TEXT DEFAULT 'Still unsure? Call us — we''re happy to chat.',
ADD COLUMN     "faqTitle" TEXT DEFAULT 'Common questions.',
ADD COLUMN     "footerClinicName" TEXT,
ADD COLUMN     "footerText" TEXT,
ADD COLUMN     "formBadge" TEXT NOT NULL DEFAULT 'FREE CONSULTATION',
ADD COLUMN     "formButtonText" TEXT NOT NULL DEFAULT 'Claim my free consultation',
ADD COLUMN     "formCallbackText" TEXT NOT NULL DEFAULT 'We''ll call you within 5 minutes — Mon to Sat, 8am–8pm.',
ADD COLUMN     "formGuarantees" TEXT[] DEFAULT ARRAY['Completely free', 'No hard sell', 'We''ll reply promptly']::TEXT[],
ADD COLUMN     "formSubtitle" TEXT NOT NULL DEFAULT 'No charge. No obligation. Tell us what you''d like to achieve and we''ll guide you through your options.',
ADD COLUMN     "formTitle" TEXT NOT NULL DEFAULT 'Book Your Free Consultation',
ADD COLUMN     "heroBadge" TEXT NOT NULL DEFAULT 'DENTAL IMPLANTS',
ADD COLUMN     "heroHighlights" TEXT[] DEFAULT ARRAY['Free consultation, no obligation', 'Medically-trained practitioners', 'No surgery, no downtime', 'Results in days']::TEXT[],
ADD COLUMN     "hideTreatmentSelect" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "howItWorksBadge" TEXT DEFAULT 'How It Works',
ADD COLUMN     "howItWorksSubtitle" TEXT DEFAULT 'The whole process is straightforward, dentist-led, and at your own pace.',
ADD COLUMN     "howItWorksTitle" TEXT DEFAULT 'Three steps to your new smile.',
ADD COLUMN     "lockedTreatment" TEXT,
ADD COLUMN     "logoUrl" TEXT,
ADD COLUMN     "navCtaText" TEXT NOT NULL DEFAULT 'Book Free Consultation',
ADD COLUMN     "navPhone" TEXT,
ADD COLUMN     "navWhatsapp" TEXT,
ADD COLUMN     "secondaryCtaBadge" TEXT DEFAULT 'Book Now',
ADD COLUMN     "secondaryCtaButtonText" TEXT DEFAULT 'Claim my free consultation',
ADD COLUMN     "secondaryCtaConcerns" TEXT[] DEFAULT ARRAY['Crowding', 'Gaps / Spacing', 'Bite Issues', 'Something else']::TEXT[],
ADD COLUMN     "secondaryCtaPhone" TEXT,
ADD COLUMN     "secondaryCtaSubtitle" TEXT DEFAULT 'Book your free consultation — we''ll assess your smile, answer every question, and show you exactly what treatment would look like for you. Zero cost, zero obligation.',
ADD COLUMN     "secondaryCtaTitle" TEXT DEFAULT 'Ready to see what''s possible?',
ADD COLUMN     "secondaryCtaWhatsapp" TEXT,
ADD COLUMN     "showDoctorSection" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "showFaqSection" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "showFooterSection" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "showHowItWorksSection" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "showSecondaryCtaSection" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "showTestimonialsSection" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "showVideoSection" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "subheadline" TEXT DEFAULT 'done properly.',
ADD COLUMN     "testimonialBadge" TEXT DEFAULT 'Patient Stories',
ADD COLUMN     "testimonialRating" DOUBLE PRECISION DEFAULT 5.0,
ADD COLUMN     "testimonialReviewCount" INTEGER DEFAULT 200,
ADD COLUMN     "testimonialTitle" TEXT DEFAULT 'Real results from real Oxfordshire patients.',
ADD COLUMN     "treatmentOptions" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "videoLabel" TEXT DEFAULT 'See It For Yourself',
ADD COLUMN     "videoPosterUrl" TEXT,
ADD COLUMN     "videoSubtitle" TEXT DEFAULT 'A quick look inside the clinic, the process, and the results our patients love — straight from the team who deliver them.',
ADD COLUMN     "videoTitle" TEXT DEFAULT 'Watch how it works.',
ADD COLUMN     "videoUrl" TEXT,
ADD COLUMN     "whatsappCta" TEXT NOT NULL DEFAULT 'WhatsApp Us',
ALTER COLUMN "cta" SET DEFAULT 'Claim my free consultation';

-- CreateTable
CREATE TABLE "campaign_testimonials" (
    "id" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "detail" TEXT,
    "quote" TEXT NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 5.0,
    "highlight" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "campaign_testimonials_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "campaign_steps" (
    "id" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "stepNumber" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "campaign_steps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "campaign_faqs" (
    "id" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "campaign_faqs_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "campaign_testimonials" ADD CONSTRAINT "campaign_testimonials_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "campaigns"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campaign_steps" ADD CONSTRAINT "campaign_steps_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "campaigns"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campaign_faqs" ADD CONSTRAINT "campaign_faqs_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "campaigns"("id") ON DELETE CASCADE ON UPDATE CASCADE;
