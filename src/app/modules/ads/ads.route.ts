import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { createCampaign, getGoogleCustomers, selectGoogleCustomer } from "./ads.controller";
import { clinicAdminAuth } from "../../middlewares/auth";
import { createCampaignZodSchema, selectGoogleCustomerZodSchema } from "./ads.validation";

const router = express.Router();

router.get("/customers", clinicAdminAuth(), getGoogleCustomers);
router.post('/select-customer', validateRequest(selectGoogleCustomerZodSchema), clinicAdminAuth(), selectGoogleCustomer);
router.post('/create-campaign', validateRequest(createCampaignZodSchema), clinicAdminAuth(), createCampaign);

export const AdsRoutes = router;
