import express from "express";
import {
  initializePlan,
  getPlans,
  //   createPrice,
  //   migrateSubscribers,
  //   getOverrides,
  //   createOverride,
  //   getAuditLog,
} from "./plan.controller";
import { adminAuth } from "../../middlewares/auth";

const router = express.Router();

// Initialization (safe to call multiple times)
router.post("/initialize", adminAuth(), initializePlan);

// Plans
router.get("/", adminAuth(), getPlans);

// // Prices
// router.post("/:planType/prices", adminAuth(), createPrice);

// // Migration
// router.post("/:planType/migrate", adminAuth(), migrateSubscribers);

// // Overrides
// router.get("/overrides", adminAuth(), getOverrides);
// router.post("/overrides", adminAuth(), createOverride);

// // Audit log
// router.get("/audit-log", adminAuth(), getAuditLog);

export const PlanRoutes = router;
