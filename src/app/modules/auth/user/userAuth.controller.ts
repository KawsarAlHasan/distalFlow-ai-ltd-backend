import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import catchAsync from "../../../../shared/catchAsync";
import sendResponse from "../../../../shared/sendResponse";
import {
  confirmDeleteAccountService,
  deleteOwnAccountService,
  deleteUserService,
  forgotPasswordService,
  resendCodeService,
  setPasswordService,
  signInService,
  signupService,
  verifyEmailToDB,
  verifyOtpService,
} from "./userAuth.service";

// sign up new user
export const signUpNewUser = catchAsync(async (req: Request, res: Response) => {
  const result = await signupService(req.body);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Signup successfully",
    data: result,
  });
});

// verify email
export const verifyEmailOtp = catchAsync(
  async (req: Request, res: Response) => {
    const result = await verifyEmailToDB(req.body);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Email verified successfully",
      data: {
        token: result.createToken,
        user: result.restOfIsExistUser,
      },
    });
  },
);

// resend code
export const resendCode = catchAsync(async (req: Request, res: Response) => {
  await resendCodeService(req.body.email);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Resend code successfully",
  });
});

// user sing in
export const userLogin = catchAsync(async (req: Request, res: Response) => {
  const result = await signInService(req.body);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "User login successfully",
    data: {
      token: result.createToken,
      user: result.isExistUser,
    },
  });
});

// get user profile
export const userProfile = catchAsync(async (req: Request, res: Response) => {
  const user = (req as any).decodedUser;

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "User profile fetched successfully",
    data: user,
  });
});

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
    data: result.createToken,
  });
});

// delete user own account
export const deleteOwnAccount = catchAsync(
  async (req: Request, res: Response) => {
    const user = (req as any).decodedUser;

    await deleteOwnAccountService(user);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "User delete request successfully",
    });
  },
);

// Confirm delete user own account
export const confirmDeleteOwnAccount = catchAsync(
  async (req: Request, res: Response) => {
    const user = (req as any).decodedUser;

    const payload = {
      otp: req.body.otp,
      id: user.id,
      email: user.email,
      profile: user.profile,
    };

    await confirmDeleteAccountService(payload);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "User deleted successfully",
    });
  },
);

// Delete permanent User
export const permanentDeleteUser = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;

    const result = await deleteUserService(id);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "User deleted successfully",
      data: result,
    });
  },
);
