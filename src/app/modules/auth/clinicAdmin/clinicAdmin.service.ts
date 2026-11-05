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


// update clinic admin profile
export const updateClinicAdminProfileService = async (payload: any) => {
    const { id, name, phone, profilePic, clinicName } = payload;

    const isExistClinicAdmin = await dbClient.clinicAdmin.findUnique({
        where: { id: id },
        include: { clinic: true },
    });

    if (!isExistClinicAdmin) {
        throw new ApiError(StatusCodes.NOT_FOUND, "Clinic admin doesn't exist!");
    }

    // delete old image if new image uploaded
    if (isExistClinicAdmin.profilePic && profilePic) {
        unlinkFile(isExistClinicAdmin.profilePic);
    }

    const updated = await dbClient.$transaction(async (tx) => {
        // update clinic name if provided
        if (clinicName && isExistClinicAdmin.clinicId) {
            await tx.clinic.update({
                where: { id: isExistClinicAdmin.clinicId },
                data: { name: clinicName },
            });
        }

        const adminUpdated = await tx.clinicAdmin.update({
            where: { id: id },
            data: {
                name: name || isExistClinicAdmin.name,
                phone: phone !== undefined ? phone : isExistClinicAdmin.phone,
                profilePic: profilePic || isExistClinicAdmin.profilePic,
            },
            include: {
                clinic: {
                    select: {
                        id: true,
                        name: true,
                        city: true,
                        tradingCompany: true,
                    },
                },
            },
            omit: {
                password: true,
            },
        });

        return adminUpdated;
    });

    return updated;
};

// update clinic admin password
export const updateClinicAdminPasswordService = async (payload: any) => {
    const { id } = payload;
    const oldPassword = payload.oldPassword || payload.old_password || payload.current_password;
    const newPassword = payload.newPassword || payload.new_password;

    if (!oldPassword || !newPassword) {
        throw new ApiError(
            StatusCodes.BAD_REQUEST,
            "Both current password and new password are required!",
        );
    }

    if (newPassword.length < 6) {
        throw new ApiError(
            StatusCodes.BAD_REQUEST,
            "New password must be at least 6 characters long!",
        );
    }

    const isExistClinicAdmin = await dbClient.clinicAdmin.findUnique({
        where: { id: id },
    });

    if (!isExistClinicAdmin) {
        throw new ApiError(StatusCodes.NOT_FOUND, "Clinic admin doesn't exist!");
    }

    // verify old password
    const isPasswordMatched = await bcrypt.compare(
        oldPassword,
        isExistClinicAdmin.password,
    );

    if (!isPasswordMatched) {
        throw new ApiError(
            StatusCodes.BAD_REQUEST,
            "Current password is incorrect!",
        );
    }

    // hash new password
    const hashPassword = await bcrypt.hash(
        newPassword,
        Number(config.bcrypt_salt_rounds),
    );

    await dbClient.clinicAdmin.update({
        where: { id: id },
        data: {
            password: hashPassword,
        },
    });

    return {
        success: true,
        message: "Password updated successfully",
    };
};
