import express from "express";
import {
  getAdminBillingOverview,
  retryClinicPayment,
  exportBillingStatement,
  getClinicBilling,
  changeClinicPlan,
  requestEnterpriseSales,
  updateBillingContact,
  updatePaymentMethod,
  createStripePortalSession,
} from "./billing.controller";
import { adminAuth, clinicAdminAuth } from "../../middlewares/auth";

const router = express.Router();

// Admin Billing Routes
router.get("/admin/overview", adminAuth(), getAdminBillingOverview);
router.post("/admin/retry-payment/:clinicId", adminAuth(), retryClinicPayment);
router.get("/admin/export-statement", adminAuth(), exportBillingStatement);

// Clinic Billing Routes
router.get("/my-billing", clinicAdminAuth(), getClinicBilling);
router.post("/change-plan", clinicAdminAuth(), changeClinicPlan);
router.post("/request-sales", clinicAdminAuth(), requestEnterpriseSales);
router.patch("/billing-contact", clinicAdminAuth(), updateBillingContact);
router.patch("/update-payment-method", clinicAdminAuth(), updatePaymentMethod);
router.post("/create-portal-session", clinicAdminAuth(), createStripePortalSession);

export const BillingRoutes = router;

