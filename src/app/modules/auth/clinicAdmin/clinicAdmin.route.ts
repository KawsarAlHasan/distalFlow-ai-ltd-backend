import express from "express";
import validateRequest from "../../../middlewares/validateRequest";
import {
  loginZodSchema,
  resendCodeZodSchema,
  setPasswordZodSchema,
  verifyEmailZodSchema,
  updateClinicAdminProfileZodSchema,
  changeClinicAdminPasswordZodSchema,
} from "./clinicAdmin.validation";
import {
  clinicAdminForgotPassword,
  clinicAdminLogin,
  clinicAdminProfile,
  clinicAdminSetPassword,
  clinicAdminVerifyOtp,
  clinicAdminUpdateProfile,
  clinicAdminChangePassword,
} from "./clinicAdmin.controller";
import { clinicAdminAuth } from "../../../middlewares/auth";
import fileUploadHandler from "../../../middlewares/fileUploadHandler";

const router = express.Router();

// sign in
router.post("/signin", validateRequest(loginZodSchema), clinicAdminLogin);

// profile
router.get("/profile", clinicAdminAuth(), clinicAdminProfile);

// update profile
router.patch(
  "/update-profile",
  clinicAdminAuth(),
  fileUploadHandler(),
  validateRequest(updateClinicAdminProfileZodSchema),
  clinicAdminUpdateProfile,
);

// change password (accepts PUT or PATCH)
router.put(
  "/change-password",
  clinicAdminAuth(),
  validateRequest(changeClinicAdminPasswordZodSchema),
  clinicAdminChangePassword,
);
router.patch(
  "/change-password",
  clinicAdminAuth(),
  validateRequest(changeClinicAdminPasswordZodSchema),
  clinicAdminChangePassword,
);

// forgot password
router.post(
  "/forgot-password",
  validateRequest(resendCodeZodSchema),
  clinicAdminForgotPassword,
);

// verify otp
router.post(
  "/verify-otp",
  validateRequest(verifyEmailZodSchema),
  clinicAdminVerifyOtp,
);

// set password
router.post(
  "/set-password",
  validateRequest(setPasswordZodSchema),
  clinicAdminSetPassword,
);

export const ClinicAdminAuthRoutes = router;
