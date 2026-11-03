import { z } from "zod";

// login
export const loginZodSchema = z.object({
  body: z.object({
    email: z
      .string()
      .min(1, "Email is required")
      .email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
  }),
});

// profile update
export const updateAdminProfileZodSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    phone: z.string().optional(),
    // image:
  }),
});

// resend code
export const resendCodeZodSchema = z.object({
  body: z.object({
    email: z
      .string()
      .min(1, "Email is required")
      .email("Invalid email address"),
  }),
});

// verify email
export const verifyEmailZodSchema = z.object({
  body: z.object({
    email: z
      .string()
      .min(1, "Email is required")
      .email("Invalid email address"),
    otp: z.number().min(1, "OTP is required"),
  }),
});

// set password
export const setPasswordZodSchema = z.object({
  body: z.object({
    email: z
      .string()
      .min(1, "Email is required")
      .email("Invalid email address"),
    otp: z.number().min(1, "OTP is required"),
    password: z
      .string()
      .min(1, "Password is required")
      .min(6, "Password must be at least 6 characters"),
  }),
});

// change password
export const changePasswordZodSchema = z.object({
  body: z.object({
    oldPassword: z.string().min(1, "Password is required"),
    newPassword: z
      .string()
      .min(1, "Password is required")
      .min(6, "Password must be at least 6 characters"),
  }),
});
