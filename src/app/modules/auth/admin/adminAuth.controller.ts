import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import catchAsync from "../../../../shared/catchAsync";
import sendResponse from "../../../../shared/sendResponse";
import {
  forgotPasswordService,
  setPasswordService,
  signInService,
  updateAdminProfileService,
  updatePasswordService,
  verifyOtpService,
} from "./adminAuth.service";

// admin sing in
export const adminLogin = catchAsync(async (req: Request, res: Response) => {
  const result = await signInService(req.body);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Admin login successfully",
    data: result,
  });
});

// get admin profile
export const adminProfile = catchAsync(async (req: Request, res: Response) => {
  const admin = (req as any).decodedAdmin;

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Admin profile fetched successfully",
    data: admin,
  });
});

// Update admin by own profile
export const updateAdminProfile = catchAsync(
  async (req: Request, res: Response) => {
    const id = (req as any).decodedAdmin.id;

    let image;
    if (req.files && "image" in req.files && req.files.image[0]) {
      // Build base URL for uploaded file access
      const baseUrl = `${req.protocol}://${req.get("host")}`;

      image = `${baseUrl}/images/${req.files.image[0].filename}`;
    }

    const payload = {
      id: id,
      ...req.body,
      profilePic: image,
    };

    const result = await updateAdminProfileService(payload);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Admin profile updated successfully",
      data: result,
    });
  },
);

// forgot password
export const forgotPassword = catchAsync(
  async (req: Request, res: Response) => {
    await forgotPasswordService(req.body);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Password reset successfully",
    });
  },
);

// verify otp
export const verifyOtp = catchAsync(async (req: Request, res: Response) => {
  await verifyOtpService(req.body);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "OTP verified successfully",
  });
});

// set password
export const setPassword = catchAsync(async (req: Request, res: Response) => {
  const result = await setPasswordService(req.body);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Password set successfully",
    data: result,
  });
});

// update password
export const updatePassword = catchAsync(
  async (req: Request, res: Response) => {
    const id = (req as any).decodedAdmin.id;

    const payload = { ...req.body, id: id };

    const result = await updatePasswordService(payload);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Password updated successfully",
      data: result,
    });
  },
);
