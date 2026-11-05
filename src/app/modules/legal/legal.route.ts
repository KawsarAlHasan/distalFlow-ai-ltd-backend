import express from "express";
import {
  getAdminDocuments,
  getDocumentById,
  createDocumentVersion,
  updateDocument,
  publishDocumentVersion,
  getClinicAcceptances,
  getActiveDocument,
  getMyAgreements,
  getAcceptanceStatus,
  acceptLegalAgreements,
} from "./legal.controller";
import { adminAuth, clinicAdminAuth } from "../../middlewares/auth";

const router = express.Router();

// Admin Routes
router.get("/admin/documents", adminAuth(), getAdminDocuments);
router.get("/admin/documents/:id", adminAuth(), getDocumentById);
router.post("/admin/documents", adminAuth(), createDocumentVersion);
router.patch("/admin/documents/:id", adminAuth(), updateDocument);
router.patch("/admin/documents/:id/publish", adminAuth(), publishDocumentVersion);
router.get("/admin/acceptances", adminAuth(), getClinicAcceptances);

// Public Routes (for landing page / visitor browsing)
router.get("/active", getActiveDocument);

// Clinic Admin Routes
router.get("/my-agreements", clinicAdminAuth(), getMyAgreements);
router.get("/acceptance-status", clinicAdminAuth(), getAcceptanceStatus);
router.post("/accept", clinicAdminAuth(), acceptLegalAgreements);

export const LegalRoutes = router;

