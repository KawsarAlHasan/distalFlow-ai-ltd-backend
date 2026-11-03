import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import catchAsync from "../../../../shared/catchAsync";
import sendResponse from "../../../../shared/sendResponse";
import { forgotClinicAdminPasswordService, setPasswordClinicAdminService, signInClinicAdminService, verifyClinicAdminOtpService } from "./clinicAdmin.service";



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

// clinic admin forgot password
export const clinicAdminForgotPassword = catchAsync(
    async (req: Request, res: Response) => {
        await forgotClinicAdminPasswordService(req.body);

        sendResponse(res, {
            success: true,
            statusCode: StatusCodes.OK,
            message: "Clinic admin forgot password successfully",
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
        data: result.createToken,
    });
});
