import { StatusCodes } from "http-status-codes";
import bcrypt from "bcrypt";
import ApiError from "../../../../errors/ApiError";
import { dbClient } from "../../../../lib/prisma";
import config from "../../../../config";
import generateOTP from "../../../../util/generateOTP";
import { emailTemplate } from "../../../../shared/emailTemplate";
import { emailHelper } from "../../../../helpers/emailHelper";
import { createAuthToken } from "../../../../helpers/jwtHelper";
import unlinkFile from "../../../../shared/unlinkFile";


// sign in
export const signInClinicAdminService = async (payload: any) => {
    const { email, password } = payload;

    const isExistClinicAdmin = await dbClient.clinicAdmin.findUnique({
        where: { email },
    });
    if (!isExistClinicAdmin) {
        throw new ApiError(
            StatusCodes.BAD_REQUEST,
            "Login failed. Please check your credentials.",
        );
    }

    const isPasswordMatched = await bcrypt.compare(
        password,
        isExistClinicAdmin.password,
    );

    if (!isPasswordMatched) {
        throw new ApiError(
            StatusCodes.BAD_REQUEST,
            "Login failed. Please check your credentials.",
        );
    }

    if (!isExistClinicAdmin.isVerified) {
        throw new ApiError(
            StatusCodes.BAD_REQUEST,
            "Clinic admin is not verified! Please verify your email.",
        );
    }

    if (isExistClinicAdmin.status !== "ACTIVE") {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Clinic admin is not active!");
    }

    //create token
    const createToken = createAuthToken({
        id: isExistClinicAdmin.id,
        role: "clinic_admin",
    });

    // exclude password
    const { password: _, ...restOfClinicAdmin } = isExistClinicAdmin;

    return { createToken, isExistClinicAdmin: restOfClinicAdmin };
};

// forgot password
export const forgotClinicAdminPasswordService = async (payload: any) => {
    const { email } = payload;

    const isExistClinicAdmin = await dbClient.clinicAdmin.findUnique({
        where: { email },
    });
    if (!isExistClinicAdmin) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Clinic Admin doesn't exist!");
    }

    //send email
    const otp = generateOTP();
    const values = {
        name: isExistClinicAdmin?.name || "",
        otp: otp,
        email: email!,
    };

    await dbClient.otp.deleteMany({
        where: {
            email: email,
        },
    });

    // otp saved to DB
    const otpPayload = {
        otp: otp,
        email: email,
        type: "CLINIC_ADMIN_RESET_PASSWORD",
        expiresAt: new Date(Date.now() + 5 * 60000),
    };

    await dbClient.otp.create({
        data: otpPayload,
    });

    const resetPasswordTemplate = emailTemplate.resetPassword(values);
    emailHelper(resetPasswordTemplate);

    return isExistClinicAdmin;
};

// verify otp
export const verifyClinicAdminOtpService = async (payload: any) => {
    const { email, otp } = payload;

    const isExistOtp = await dbClient.otp.findFirst({
        where: { email, type: "CLINIC_ADMIN_RESET_PASSWORD" },
    });
    if (!isExistOtp) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Otp doesn't exist!");
    }

    if (isExistOtp.otp !== otp) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid Otp!");
    }

    const date = new Date();
    if (date > isExistOtp.expiresAt) {
        await dbClient.otp.deleteMany({
            where: {
                email: email,
            },
        });

        throw new ApiError(
            StatusCodes.BAD_REQUEST,
            "Otp already expired, Please try again",
        );
    }

    return isExistOtp;
};

// set password
export const setPasswordClinicAdminService = async (payload: any) => {
    const { email, otp, password } = payload;

    const isExistOtp = await dbClient.otp.findFirst({
        where: { email, type: "CLINIC_ADMIN_RESET_PASSWORD" },
    });
    if (!isExistOtp) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Otp doesn't exist!");
    }

    if (isExistOtp.otp !== otp) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid Otp!");
    }

    const date = new Date();
    if (date > isExistOtp.expiresAt) {
        await dbClient.otp.deleteMany({
            where: {
                email: email,
            },
        });

        throw new ApiError(
            StatusCodes.BAD_REQUEST,
            "Otp already expired, Please try again",
        );
    }

    const isExistClinicAdmin = await dbClient.clinicAdmin.findUnique({
        where: { email },
    });
    if (!isExistClinicAdmin) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Clinic Admin doesn't exist!");
    }

    const hashPassword = await bcrypt.hash(
        password,
        Number(config.bcrypt_salt_rounds),
    );

    await dbClient.clinicAdmin.update({
        where: { id: isExistClinicAdmin.id },
        data: {
            password: hashPassword,
        },
    });

    // delete otp
    await dbClient.otp.deleteMany({
        where: {
            email: email,
        },
    });

    //create token
    const createToken = createAuthToken({
        id: isExistClinicAdmin.id,
        role: "clinic_admin",
    });

    return { createToken };
};