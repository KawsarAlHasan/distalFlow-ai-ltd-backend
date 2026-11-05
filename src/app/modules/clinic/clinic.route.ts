import express from "express";
import {
  createNewClinic,
  getAllClinics,
  getClinicById,
  updateClinicStatus,
} from "./clinic.controller";
import { adminAuth } from "../../middlewares/auth";

const router = express.Router();

// Onboard / Create Clinic (from Admin Onboarding flow or public checkout)
router.post("/create", createNewClinic);

// Admin endpoints for Clinics table, search, filters & details
router.get("/admin/all", adminAuth(), getAllClinics);
router.get("/", adminAuth(), getAllClinics);
router.get("/:id", adminAuth(), getClinicById);
router.patch("/:id/status", adminAuth(), updateClinicStatus);

export const ClinicRoutes = router;
