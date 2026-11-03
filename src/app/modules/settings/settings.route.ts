import express from "express";
import { googleCallbackRedirect, googleConnectAdsAccount } from "./settings.controller";
import { clinicAdminAuth } from "../../middlewares/auth";

const router = express.Router();

router.get('/google', clinicAdminAuth(), googleConnectAdsAccount);
router.get('/google/callback', googleCallbackRedirect);

export const SettingsRoutes = router;
