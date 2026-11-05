import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import catchAsync from "../../../../shared/catchAsync";
import sendResponse from "../../../../shared/sendResponse";
import {
  forgotClinicAdminPasswordService,
  setPasswordClinicAdminService,
  signInClinicAdminService,
  verifyClinicAdminOtpService,
  updateClinicAdminProfileService,
  updateClinicAdminPasswordService,
} from "./clinicAdmin.service";

// clinic admin sign in
export const clinicAdminLogin = catchAsync(async (req: Request, res: Response) => {
  const result = await signInClinicAdminService(req.body);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Clinic admin login successfully",
    data: {
      token: result.createToken,
      admin: result.isExistClinicAdmin,
    },
  });
});

// clinic admin profile
export const clinicAdminProfile = catchAsync(async (req: Request, res: Response) => {
  const clinicAdmin = (req as any).decodedClinicAdmin;

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Clinic admin profile fetched successfully",
    data: clinicAdmin,
  });
});

// clinic admin update profile
export const clinicAdminUpdateProfile = catchAsync(async (req: Request, res: Response) => {
  const id = (req as any).decodedClinicAdmin?.id;

  let image;
  if (req.files && "image" in req.files && req.files.image[0]) {
    const baseUrl = `${req.protocol}://${req.get("host")}`;
    image = `${baseUrl}/images/${req.files.image[0].filename}`;
  } else if (req.files && "profile_image" in req.files && req.files.profile_image[0]) {
    const baseUrl = `${req.protocol}://${req.get("host")}`;
    image = `${baseUrl}/images/${req.files.profile_image[0].filename}`;
  }

  const payload = {
    id,
    ...req.body,
    profilePic: image || req.body.profilePic || req.body.profile_image,
  };

  const result = await updateClinicAdminProfileService(payload);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Clinic admin profile updated successfully",
    data: result,
  });
});

// clinic admin change password
export const clinicAdminChangePassword = catchAsync(async (req: Request, res: Response) => {
  const id = (req as any).decodedClinicAdmin?.id;

  const payload = {
    id,
    ...req.body,
  };

  const result = await updateClinicAdminPasswordService(payload);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Password changed successfully",
    data: result,
  });
});

// clinic admin forgot password
export const clinicAdminForgotPassword = catchAsync(
  async (req: Request, res: Response) => {
    await forgotClinicAdminPasswordService(req.body);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Reset code sent to your email successfully",
    });
  },
);

// verify otp
export const clinicAdminVerifyOtp = catchAsync(async (req: Request, res: Response) => {
  await verifyClinicAdminOtpService(req.body);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Clinic admin OTP verified successfully",
  });
});

// set password
export const clinicAdminSetPassword = catchAsync(async (req: Request, res: Response) => {
  const result = await setPasswordClinicAdminService(req.body);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Clinic admin password set successfully",
    data: {
      token: result.createToken,
    },
  });
});
