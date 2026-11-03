import express from "express";
import validateRequest from "../../../middlewares/validateRequest";
import {
  deleteOTPZodSchema,
  loginZodSchema,
  resendCodeZodSchema,
  setPasswordZodSchema,
  signupZodSchema,
  verifyEmailZodSchema,
} from "./userAuth.validation";
import {
  confirmDeleteOwnAccount,
  deleteOwnAccount,
  forgotPassword,
  permanentDeleteUser,
  resendCode,
  setPassword,
  signUpNewUser,
  userLogin,
  userProfile,
  verifyEmailOtp,
  verifyOtp,
} from "./userAuth.controller";
import { userAuth } from "../../../middlewares/auth";
const router = express.Router();

router.post("/signup", validateRequest(signupZodSchema), signUpNewUser);
router.post(
  "/verify-email",
  validateRequest(verifyEmailZodSchema),
  verifyEmailOtp,
);
router.post("/resend-code", validateRequest(resendCodeZodSchema), resendCode);

// sign in
router.post("/signin", validateRequest(loginZodSchema), userLogin);

router.get("/profile", userAuth(), userProfile);

router.post(
  "/forgot-password",
  validateRequest(resendCodeZodSchema),
  forgotPassword,
);

router.post("/verify-otp", validateRequest(verifyEmailZodSchema), verifyOtp);

router.post(
  "/set-password",
  validateRequest(setPasswordZodSchema),
  setPassword,
);

// delete request
router.post("/account-delete", userAuth(), deleteOwnAccount);

// confirm delete
router.post(
  "/account-delete-confirm",
  validateRequest(deleteOTPZodSchema),
  userAuth(),
  confirmDeleteOwnAccount,
);

router.delete("/:id", permanentDeleteUser);

export const UserAuthRoutes = router;
