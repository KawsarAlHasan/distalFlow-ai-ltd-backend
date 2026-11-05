import { StatusCodes } from "http-status-codes";
import ApiError from "../../../errors/ApiError";
import { dbClient } from "../../../lib/prisma";
import {
  LegalDocumentStatus,
  LegalDocumentType,
} from "../../../../generated/prisma/client";

// ---------------------------------------------------------------------------
// Seed Data: Default Terms of Service & Privacy Policy (v1.0)
// ---------------------------------------------------------------------------

const defaultTermsSections = [
  {
    id: "s1",
    label: "Introduction & Agreement",
    title: "1. Introduction and Agreement",
    content:
      "These Platform Terms and Conditions govern access to and use of the DistalFlo AI platform. By accessing or using the Platform, the Clinic agrees to be legally bound by these Terms. The Platform is provided solely for commercial and professional use by registered dental and healthcare clinics.",
  },
  {
    id: "s2",
    label: "Definitions",
    title: "2. Definitions & Interpretations",
    content:
      "'Platform' refers to the DistalFlo web application, AI agents, reporting suites, and integrations. 'Clinic' means the legal entity subscribing to the service. 'Patient Data' refers to all personal, clinical, or contact details submitted by or captured from prospective and active patients.",
  },
  {
    id: "s3",
    label: "Subscriptions & Access",
    title: "3. Subscriptions, Fees & Billing",
    content:
      "Subscription tiers (Solo, Growth, Pro, Enterprise) define campaign limits, included locations, and platform features. All recurring fees are billed in advance on a monthly basis via Stripe. Setup fees are one-off and non-refundable once campaign onboarding begins.",
  },
  {
    id: "s4",
    label: "Geographic Exclusivity",
    title: "4. Postcode Exclusivity Guarantee",
    content:
      "Subject to maintaining an active subscription, DistalFlo grants the Clinic exclusive marketing rights within agreed outward postcode sectors (e.g., OX1–OX4). DistalFlo shall not onboard or run competing patient acquisition campaigns for another dental clinic within the reserved sectors.",
  },
  {
    id: "s5",
    label: "Clinic Obligations",
    title: "5. Clinic Warranties & Compliance",
    content:
      "The Clinic warrants that all clinical treatments promoted via the Platform comply with General Dental Council (GDC) standards and relevant advertising codes (ASA/CAP). The Clinic maintains professional indemnity insurance and is solely responsible for patient treatment decisions.",
  },
  {
    id: "s6",
    label: "Acceptable Use",
    title: "6. Acceptable Use Policy",
    content:
      "The Clinic agrees not to reverse engineer the Platform, send unsolicited bulk communications outside permitted nurture workflows, or upload malicious code. Breaches of this section result in immediate suspension.",
  },
  {
    id: "s7",
    label: "AI & Campaign Automation",
    title: "7. AI Agents & Automated Communications",
    content:
      "The Platform utilizes automated AI models to conduct patient triage, qualifying calls, and nurture messaging. All AI interactions state clearly that communication is automated. The Clinic retains oversight of patient interactions.",
  },
  {
    id: "s8",
    label: "Intellectual Property",
    title: "8. Intellectual Property Rights",
    content:
      "All intellectual property in the Platform, including proprietary algorithms, prompt engineering, designs, and workflows, remains the exclusive property of DistalFlo AI Ltd. The Clinic retains all rights to its trademarks, clinic logos, and patient records.",
  },
  {
    id: "s9",
    label: "Data Protection",
    title: "9. Data Protection & GDPR",
    content:
      "The Clinic acts as Data Controller and DistalFlo acts as Data Processor. Both parties agree to abide by the UK GDPR, Data Protection Act 2018, and the terms of the Data Processing Agreement incorporated herein.",
  },
  {
    id: "s10",
    label: "GDPR Data Deletion",
    title: "10. Right of Erasure & Deletion Ledger",
    content:
      "Upon request from a patient or clinic admin, patient records and associated call transcripts, recordings, and message histories undergo permanent cascade deletion across all databases, followed by generation of a cryptographically signed deletion certificate.",
  },
  {
    id: "s11",
    label: "Limitation of Liability",
    title: "11. Limitation of Liability",
    content:
      "Except in cases of death or personal injury caused by negligence or fraud, DistalFlo's maximum aggregate liability arising out of or related to these Terms shall not exceed the total fees paid by the Clinic in the 12 months preceding the claim.",
  },
  {
    id: "s12",
    label: "Confidentiality",
    title: "12. Confidentiality",
    content:
      "Each party agrees to maintain strict confidentiality of all commercial, technical, and operational secrets disclosed by the other party for the duration of the agreement and for a period of five (5) years thereafter.",
  },
  {
    id: "s13",
    label: "Termination",
    title: "13. Term & Termination",
    content:
      "Either party may terminate the subscription with thirty (30) days written notice prior to the end of any billing cycle. Upon termination, access ceases and postcodes are released back to the general pool.",
  },
  {
    id: "s14",
    label: "Governing Law",
    title: "14. Governing Law & Jurisdiction",
    content:
      "These Terms and any dispute or claim arising out of or in connection with them shall be governed by and construed in accordance with the laws of England and Wales, and the courts of England shall have exclusive jurisdiction.",
  },
  {
    id: "s15",
    label: "General",
    title: "15. General Provisions",
    content:
      "If any provision of these Terms is held to be invalid or unenforceable, the remaining provisions shall remain in full force and effect. No failure or delay by either party in exercising any right shall constitute a waiver.",
  },
];

const defaultPrivacySections = [
  {
    id: "p1",
    label: "Introduction & Scope",
    title: "1. Introduction & Overview",
    content:
      "This Privacy Policy outlines how DistalFlo AI Ltd collects, stores, processes, and protects personal and sensitive data. We are committed to transparency, security, and full compliance with the UK GDPR and Data Protection Act 2018.",
  },
  {
    id: "p2",
    label: "Who We Are & Key Contact",
    title: "2. Identity & Contact Details",
    content:
      "DistalFlo AI Ltd is a company registered in England and Wales. For any data protection inquiries, privacy questions, or Data Protection Officer contact, email privacy@distalflo.co.uk.",
  },
  {
    id: "p3",
    label: "The Dual-Role Architecture",
    title: "3. Controller vs. Processor Architecture",
    content:
      "For Clinic Account information (admin names, email, billing), DistalFlo acts as Data Controller. For Patient Data collected via ads, lead forms, and nurture workflows, the Clinic is the Data Controller and DistalFlo acts solely as a Data Processor.",
  },
  {
    id: "p4",
    label: "Categories of Personal Data",
    title: "4. Data Categories Collected",
    content:
      "We collect and process: (a) Clinic Admin contact and billing data; (b) Patient prospect data including names, phone numbers, treatment interests, and appointment slots; (c) Telephony call recordings and AI audio transcripts.",
  },
  {
    id: "p5",
    label: "Lawful Bases for Processing",
    title: "5. Lawful Bases for Processing",
    content:
      "Processing is conducted under: (a) Performance of Contract for subscription delivery; (b) Legitimate Interests for platform analytics and fraud prevention; (c) Consent obtained directly from patients for marketing and clinical contact.",
  },
  {
    id: "p6",
    label: "Sub-processors & Partners",
    title: "6. Approved Sub-processors",
    content:
      "We engage vetted sub-processors under strict Article 28 data processing agreements: Amazon Web Services (UK/EU hosting), Twilio/WhatsApp (messaging delivery), Stripe (payment processing), and Google Cloud (AI transcription).",
  },
  {
    id: "p7",
    label: "International Transfers",
    title: "7. International Data Transfers",
    content:
      "All primary databases are hosted in the United Kingdom or European Economic Area. Any cross-border data transfer complies with UK International Data Transfer Agreements (IDTA) or European Standard Contractual Clauses (SCCs).",
  },
  {
    id: "p8",
    label: "Data Retention & Deletion",
    title: "8. Data Retention & Erasure Protocols",
    content:
      "Patient data is retained only for as long as necessary to fulfill clinic appointments. Erasure requests trigger automated cascade deletion across databases within 24 hours, recording an immutable cryptographic audit record.",
  },
  {
    id: "p9",
    label: "Data Subject Rights",
    title: "9. Your Data Subject Rights",
    content:
      "Under UK GDPR, individuals have rights to: (a) Access their data; (b) Rectification of errors; (c) Erasure ('Right to be forgotten'); (d) Restriction of processing; (e) Data portability; and (f) Objection to processing.",
  },
  {
    id: "p10",
    label: "Security Measures",
    title: "10. Technical & Organizational Security",
    content:
      "We implement TLS 1.3 encryption in transit, AES-256 encryption at rest, role-based access control (RBAC), multi-factor authentication, regular third-party penetration testing, and continuous security auditing.",
  },
  {
    id: "p11",
    label: "Breach Notification",
    title: "11. Incident & Breach Procedures",
    content:
      "In the event of a personal data breach impacting patient records, DistalFlo will notify affected clinic controllers within 24 hours of confirmation, providing all required forensic details to support ICO reporting.",
  },
  {
    id: "p12",
    label: "Changes to this Policy",
    title: "12. Policy Versioning & Updates",
    content:
      "We update this Privacy Policy periodically. Historical versions are archived and each Clinic remains bound to the version agreed at onboarding until affirmative acceptance of updated terms.",
  },
];

// ---------------------------------------------------------------------------
// Helpers & Initializer
// ---------------------------------------------------------------------------

export const ensureDefaultLegalDocumentsService = async () => {
  const termsCount = await dbClient.legalDocument.count({
    where: { type: LegalDocumentType.TERMS_OF_SERVICE },
  });

  if (termsCount === 0) {
    await dbClient.legalDocument.create({
      data: {
        type: LegalDocumentType.TERMS_OF_SERVICE,
        version: "v1.0",
        title: "Platform Terms and Conditions",
        changeSummary: "Initial platform terms and conditions release.",
        content: defaultTermsSections as any,
        status: LegalDocumentStatus.ACTIVE,
        publishedAt: new Date(),
        effectiveDate: new Date(),
      },
    });
  }

  const privacyCount = await dbClient.legalDocument.count({
    where: { type: LegalDocumentType.PRIVACY_POLICY },
  });

  if (privacyCount === 0) {
    await dbClient.legalDocument.create({
      data: {
        type: LegalDocumentType.PRIVACY_POLICY,
        version: "v1.0",
        title: "Platform Privacy Policy",
        changeSummary: "Initial platform privacy policy release.",
        content: defaultPrivacySections as any,
        status: LegalDocumentStatus.ACTIVE,
        publishedAt: new Date(),
        effectiveDate: new Date(),
      },
    });
  }
};

// ---------------------------------------------------------------------------
// ADMIN SERVICES
// ---------------------------------------------------------------------------

export const getAdminDocumentsService = async (type: LegalDocumentType) => {
  await ensureDefaultLegalDocumentsService();

  const documents = await dbClient.legalDocument.findMany({
    where: { type },
    include: {
      termsAcceptances: { select: { id: true } },
      privacyAcceptances: { select: { id: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return documents.map((doc) => {
    const acceptedCount =
      type === LegalDocumentType.TERMS_OF_SERVICE
        ? doc.termsAcceptances.length
        : doc.privacyAcceptances.length;

    return {
      id: doc.id,
      type: doc.type,
      version: doc.version,
      title: doc.title,
      changeSummary: doc.changeSummary,
      status: doc.status,
      effectiveDate: doc.effectiveDate,
      publishedAt: doc.publishedAt,
      createdAt: doc.createdAt,
      acceptedCount,
    };
  });
};

export const getDocumentByIdService = async (id: string) => {
  const doc = await dbClient.legalDocument.findUnique({
    where: { id },
    include: {
      termsAcceptances: {
        include: {
          clinic: { select: { id: true, name: true, city: true } },
          clinicAdmin: { select: { id: true, name: true, email: true } },
        },
        take: 50,
      },
      privacyAcceptances: {
        include: {
          clinic: { select: { id: true, name: true, city: true } },
          clinicAdmin: { select: { id: true, name: true, email: true } },
        },
        take: 50,
      },
    },
  });

  if (!doc) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Document not found");
  }

  return doc;
};

export const createDocumentVersionService = async (
  payload: {
    type: LegalDocumentType;
    version: string;
    title: string;
    changeSummary?: string;
    content: any;
    status?: LegalDocumentStatus;
  },
  adminId?: string,
) => {
  const { type, version, title, changeSummary, content, status = LegalDocumentStatus.DRAFT } = payload;

  // Check version uniqueness
  const existing = await dbClient.legalDocument.findUnique({
    where: {
      type_version: {
        type,
        version,
      },
    },
  });

  if (existing) {
    throw new ApiError(
      StatusCodes.CONFLICT,
      `Version ${version} already exists for ${type}.`,
    );
  }

  return await dbClient.$transaction(async (tx) => {
    // If published as ACTIVE, archive previous active version
    if (status === LegalDocumentStatus.ACTIVE) {
      await tx.legalDocument.updateMany({
        where: { type, status: LegalDocumentStatus.ACTIVE },
        data: { status: LegalDocumentStatus.ARCHIVED },
      });
    }

    const created = await tx.legalDocument.create({
      data: {
        type,
        version,
        title,
        changeSummary,
        content: content || [],
        status,
        publishedAt: status === LegalDocumentStatus.ACTIVE ? new Date() : null,
        createdById: adminId,
      },
    });

    return created;
  });
};

export const updateDocumentService = async (
  id: string,
  payload: {
    title?: string;
    changeSummary?: string;
    content?: any;
    version?: string;
  },
) => {
  const doc = await dbClient.legalDocument.findUnique({ where: { id } });
  if (!doc) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Document not found");
  }

  const updated = await dbClient.legalDocument.update({
    where: { id },
    data: {
      title: payload.title,
      changeSummary: payload.changeSummary,
      content: payload.content !== undefined ? payload.content : undefined,
      version: payload.version,
    },
  });

  return updated;
};

export const publishDocumentVersionService = async (id: string, adminId?: string) => {
  const doc = await dbClient.legalDocument.findUnique({ where: { id } });
  if (!doc) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Document not found");
  }

  return await dbClient.$transaction(async (tx) => {
    // Archive other active documents of same type
    await tx.legalDocument.updateMany({
      where: {
        type: doc.type,
        status: LegalDocumentStatus.ACTIVE,
        id: { not: id },
      },
      data: { status: LegalDocumentStatus.ARCHIVED },
    });

    // Set this document to ACTIVE
    const published = await tx.legalDocument.update({
      where: { id },
      data: {
        status: LegalDocumentStatus.ACTIVE,
        publishedAt: new Date(),
        createdById: adminId,
      },
    });

    return published;
  });
};

export const getClinicAcceptancesService = async (type?: LegalDocumentType) => {
  const acceptances = await dbClient.clinicLegalAcceptance.findMany({
    include: {
      clinic: { select: { id: true, name: true, city: true } },
      clinicAdmin: { select: { id: true, name: true, email: true } },
      termsDocument: { select: { id: true, version: true, title: true } },
      privacyDocument: { select: { id: true, version: true, title: true } },
    },
    orderBy: { acceptedAt: "desc" },
  });

  return acceptances.map((acc) => ({
    id: acc.id,
    clinicId: acc.clinicId,
    clinicName: acc.clinic?.name || "Clinic",
    city: acc.clinic?.city || "—",
    adminName: acc.clinicAdmin?.name || "Clinic Admin",
    adminEmail: acc.clinicAdmin?.email || "—",
    termsVersion: acc.termsDocument?.version || "—",
    privacyVersion: acc.privacyDocument?.version || "—",
    acceptedAt: acc.acceptedAt,
    ipAddress: acc.ipAddress || "—",
  }));
};

// ---------------------------------------------------------------------------
// PUBLIC & CLINIC ADMIN SERVICES
// ---------------------------------------------------------------------------

export const getActiveDocumentService = async (type: LegalDocumentType) => {
  await ensureDefaultLegalDocumentsService();

  const doc = await dbClient.legalDocument.findFirst({
    where: {
      type,
      status: LegalDocumentStatus.ACTIVE,
    },
    orderBy: { createdAt: "desc" },
  });

  if (!doc) {
    // Fallback to latest
    const latest = await dbClient.legalDocument.findFirst({
      where: { type },
      orderBy: { createdAt: "desc" },
    });
    return latest;
  }

  return doc;
};

export const getMyAgreementsService = async (
  clinicAdminId: string,
  type?: LegalDocumentType,
) => {
  await ensureDefaultLegalDocumentsService();

  const clinicAdmin = await dbClient.clinicAdmin.findUnique({
    where: { id: clinicAdminId },
    include: {
      clinic: {
        include: {
          legalAcceptances: {
            include: {
              termsDocument: true,
              privacyDocument: true,
            },
            orderBy: { acceptedAt: "desc" },
            take: 1,
          },
        },
      },
    },
  });

  if (!clinicAdmin || !clinicAdmin.clinic) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Clinic profile not found");
  }

  const latestAcceptance = clinicAdmin.clinic.legalAcceptances[0];

  // Fetch current platform active versions for comparison/notice
  const activeTerms = await getActiveDocumentService(LegalDocumentType.TERMS_OF_SERVICE);
  const activePrivacy = await getActiveDocumentService(LegalDocumentType.PRIVACY_POLICY);

  if (!latestAcceptance) {
    // Clinic has not accepted any version yet; return active platform documents
    return {
      isAcceptedVersion: false,
      acceptedAt: null,
      terms: activeTerms,
      privacy: activePrivacy,
      currentActiveVersion: {
        terms: activeTerms?.version,
        privacy: activePrivacy?.version,
      },
    };
  }

  // Clinic HAS accepted a version! Return the locked version they accepted!
  return {
    isAcceptedVersion: true,
    acceptedAt: latestAcceptance.acceptedAt,
    terms: latestAcceptance.termsDocument,
    privacy: latestAcceptance.privacyDocument,
    currentActiveVersion: {
      terms: activeTerms?.version,
      privacy: activePrivacy?.version,
    },
  };
};

export const getAcceptanceStatusService = async (clinicAdminId: string) => {
  const clinicAdmin = await dbClient.clinicAdmin.findUnique({
    where: { id: clinicAdminId },
    include: {
      clinic: {
        include: {
          legalAcceptances: {
            orderBy: { acceptedAt: "desc" },
            take: 1,
          },
        },
      },
    },
  });

  if (!clinicAdmin || !clinicAdmin.clinic) {
    return { hasAccepted: false };
  }

  const latest = clinicAdmin.clinic.legalAcceptances[0];
  const activeTerms = await getActiveDocumentService(LegalDocumentType.TERMS_OF_SERVICE);
  const activePrivacy = await getActiveDocumentService(LegalDocumentType.PRIVACY_POLICY);

  return {
    hasAccepted: !!latest,
    acceptance: latest || null,
    activeDocuments: {
      termsId: activeTerms?.id,
      termsVersion: activeTerms?.version,
      privacyId: activePrivacy?.id,
      privacyVersion: activePrivacy?.version,
    },
  };
};

export const acceptLegalAgreementsService = async (
  clinicAdminId: string,
  termsDocumentId: string,
  privacyDocumentId: string,
  reqInfo: { ip?: string; userAgent?: string },
) => {
  const clinicAdmin = await dbClient.clinicAdmin.findUnique({
    where: { id: clinicAdminId },
    select: { id: true, clinicId: true },
  });

  if (!clinicAdmin) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Clinic admin not found");
  }

  // Verify that document IDs exist
  const termsDoc = await dbClient.legalDocument.findUnique({ where: { id: termsDocumentId } });
  const privacyDoc = await dbClient.legalDocument.findUnique({ where: { id: privacyDocumentId } });

  if (!termsDoc || !privacyDoc) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid document version IDs provided");
  }

  const acceptance = await dbClient.clinicLegalAcceptance.create({
    data: {
      clinicId: clinicAdmin.clinicId,
      clinicAdminId: clinicAdmin.id,
      termsDocumentId: termsDoc.id,
      privacyDocumentId: privacyDoc.id,
      ipAddress: reqInfo.ip || null,
      userAgent: reqInfo.userAgent || null,
      acceptedAt: new Date(),
    },
  });

  return {
    success: true,
    message: "Legal agreements accepted and locked for this clinic.",
    acceptance,
  };
};

