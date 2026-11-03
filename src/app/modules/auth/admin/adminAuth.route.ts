import express from "express";
import validateRequest from "../../../middlewares/validateRequest";
import {
  adminLogin,
  adminProfile,
  forgotPassword,
  setPassword,
  updateAdminProfile,
  updatePassword,
  verifyOtp,
} from "./adminAuth.controller";
import {
  loginZodSchema,
  updateAdminProfileZodSchema,
  resendCodeZodSchema,
  verifyEmailZodSchema,
  setPasswordZodSchema,
  changePasswordZodSchema,
} from "./adminAuth.validation";
import { adminAuth } from "../../../middlewares/auth";
import fileUploadHandler from "../../../middlewares/fileUploadHandler";
const router = express.Router();

// login
router.post("/login", validateRequest(loginZodSchema), adminLogin);

// profile
router.get("/profile", adminAuth(), adminProfile);

// update profile
router.patch(
  "/update-profile",
  adminAuth(),
  fileUploadHandler(),
  validateRequest(updateAdminProfileZodSchema),
  updateAdminProfile,
);

// forgot password
router.post(
  "/forgot-password",
  validateRequest(resendCodeZodSchema),
  forgotPassword,
);

// verify otp
router.post("/verify-otp", validateRequest(verifyEmailZodSchema), verifyOtp);

// set password
router.post(
  "/set-password",
  validateRequest(setPasswordZodSchema),
  setPassword,
);

// change password
router.put(
  "/change-password",
  adminAuth(),
  validateRequest(changePasswordZodSchema),
  updatePassword,
);

export const AdminAuthRoutes = router;
