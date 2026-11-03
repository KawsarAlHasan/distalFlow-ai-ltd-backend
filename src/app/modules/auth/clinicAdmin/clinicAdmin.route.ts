import express from "express";
import validateRequest from "../../../middlewares/validateRequest";
import {
    loginZodSchema,
    resendCodeZodSchema,
    setPasswordZodSchema,
    verifyEmailZodSchema,
} from "./clinicAdmin.validation";
import { clinicAdminForgotPassword, clinicAdminLogin, clinicAdminProfile, clinicAdminSetPassword, clinicAdminVerifyOtp } from "./clinicAdmin.controller";
import { clinicAdminAuth } from "../../../middlewares/auth";

const router = express.Router();

// sign in
router.post("/signin", validateRequest(loginZodSchema), clinicAdminLogin);

router.get("/profile", clinicAdminAuth(), clinicAdminProfile);

router.post(
    "/forgot-password",
    validateRequest(resendCodeZodSchema),
    clinicAdminForgotPassword,
);

router.post("/verify-otp", validateRequest(verifyEmailZodSchema), clinicAdminVerifyOtp);

router.post(
    "/set-password",
    validateRequest(setPasswordZodSchema),
    clinicAdminSetPassword,
);

export const ClinicAdminAuthRoutes = router;
