import express from "express";
import { AdminRoutes } from "../app/modules/admin/admin.route";
import { UserAuthRoutes } from "../app/modules/auth/user/userAuth.route";
import { AdminAuthRoutes } from "../app/modules/auth/admin/adminAuth.route";
import { PlanRoutes } from "../app/modules/plan/plan.route";
import { ClinicRoutes } from "../app/modules/clinic/clinic.route";
import { ClinicAdminAuthRoutes } from "../app/modules/auth/clinicAdmin/clinicAdmin.route";
import { SettingsRoutes } from "../app/modules/settings/settings.route";
import { AdsRoutes } from "../app/modules/ads/ads.route";
import { NurtureRoutes } from "../app/modules/nurture/nurture.route";
import { CampaignRoutes } from "../app/modules/campaign/campaign.route";

const router = express.Router();

const apiRoutes = [
  {
    path: "/auth/admin",
    route: AdminAuthRoutes,
  },
  {
    path: "/admin",
    route: AdminRoutes,
  },
  {
    path: "/auth/user",
    route: UserAuthRoutes,
  },
  {
    path: "/plan",
    route: PlanRoutes,
  },
  {
    path: "/clinic",
    route: ClinicRoutes,
  },
  {
    path: "/auth/clinic-admin",
    route: ClinicAdminAuthRoutes,
  },
  {
    path: "/ads",
    route: AdsRoutes,
  },
  {
    path: "/nurture",
    route: NurtureRoutes,
  },
  {
    path: "/settings",
    route: SettingsRoutes,
  },
  {
    path: "/campaign",
    route: CampaignRoutes,
  },
];

apiRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
