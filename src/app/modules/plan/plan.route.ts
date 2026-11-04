import express from "express";
import {
  initializePlan,
  getPlans,
  createPrice,
  migrateSubscribers,
  getOverrides,
  createOverride,
  deleteOverride,
  getAuditLog,
} from "./plan.controller";
import { adminAuth } from "../../middlewares/auth";

const router = express.Router();

// Initialization (safe to call multiple times)
router.post("/initialize", adminAuth(), initializePlan);

// Plans
router.get("/", getPlans); // Public or authenticated so clinics & onboarding can also read plans!

// Prices
router.post("/:planType/prices", adminAuth(), createPrice);

// Migration
router.post("/:planType/migrate", adminAuth(), migrateSubscribers);

// Overrides
router.get("/overrides", adminAuth(), getOverrides);
router.post("/overrides", adminAuth(), createOverride);
router.delete("/overrides/:id", adminAuth(), deleteOverride);

// Audit log
router.get("/audit-log", adminAuth(), getAuditLog);

export const PlanRoutes = router;
