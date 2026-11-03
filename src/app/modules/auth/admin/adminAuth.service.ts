import { StatusCodes } from "http-status-codes";
import bcrypt from "bcrypt";
import ApiError from "../../../../errors/ApiError";
import { dbClient } from "../../../../lib/prisma";
import config from "../../../../config";
import generateOTP from "../../../../util/generateOTP";
import { resetPasswordEmail } from "../../../../shared/emailTemplate";
import { emailHelper } from "../../../../helpers/emailHelper";
import { createAuthToken } from "../../../../helpers/jwtHelper";
import unlinkFile from "../../../../shared/unlinkFile";

// login
export const signInService = async (payload: any) => {
  const { email, password } = payload;

  const isExistAdmin = await dbClient.admin.findUnique({
    where: { email },
  });
  if (!isExistAdmin) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      "Login failed. Please check your credentials.",
    );
  }

  const isPasswordMatched = await bcrypt.compare(
    password,
    isExistAdmin.password,
  );

  if (!isPasswordMatched) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      "Login failed. Please check your credentials.",
    );
  }

  if (isExistAdmin.status !== "ACTIVE") {
    throw new ApiError(StatusCodes.BAD_REQUEST, "User is not active!");
  }

  //create token
  const createToken = createAuthToken({
    id: isExistAdmin.id,
    role: "admin",
  });

  const { password: _, ...adminWithoutPassword } = isExistAdmin;

  return {
    token: createToken,
    admin: adminWithoutPassword,
  };
};

// update admin profile
export const updateAdminProfileService = async (payload: any) => {
  const { id, name, phone, profilePic } = payload;

  // check Admin exist
  const isExistAdmin = await dbClient.admin.findUnique({
    where: { id: id },
  });
  if (!isExistAdmin) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Admin doesn't exist!");
  }

  // delete image
  if (isExistAdmin.profilePic && profilePic) {
    unlinkFile(isExistAdmin.profilePic);
  }

  // update admin
  const result = await dbClient.admin.update({
    where: { id: id },
    data: {
      name: name || isExistAdmin.name,
      phone: phone || isExistAdmin.phone,
      profilePic: profilePic || isExistAdmin.profilePic,
    },
    omit: {
      password: true,
    },
  });

  if (!result) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to update admin!");
  }

  return result;
};

// forgot password
export const forgotPasswordService = async (payload: any) => {
  const { email } = payload;

  const isExistAdmin = await dbClient.admin.findUnique({
    where: { email },
  });
  if (!isExistAdmin) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Admin doesn't exist!");
  }

  //send email
  const otp = generateOTP();
  const values = {
    name: isExistAdmin?.name || "",
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
    type: "ADMIN_RESET_PASSWORD",
    expiresAt: new Date(Date.now() + 5 * 60000),
  };

  await dbClient.otp.create({
    data: otpPayload,
  });

  const resetPasswordTemplate = resetPasswordEmail(values);
  emailHelper(resetPasswordTemplate);

  return isExistAdmin;
};

// verify otp
export const verifyOtpService = async (payload: any) => {
  const { email, otp } = payload;

  const isExistOtp = await dbClient.otp.findFirst({
    where: { email, type: "ADMIN_RESET_PASSWORD" },
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
export const setPasswordService = async (payload: any) => {
  const { email, otp, password } = payload;

  const isExistOtp = await dbClient.otp.findFirst({
    where: { email, type: "ADMIN_RESET_PASSWORD" },
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

  const isExistAdmin = await dbClient.admin.findUnique({
    where: { email },
  });
  if (!isExistAdmin) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Admin doesn't exist!");
  }

  const hashPassword = await bcrypt.hash(
    password,
    Number(config.bcrypt_salt_rounds),
  );

  await dbClient.admin.update({
    where: { id: isExistAdmin.id },
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
    id: isExistAdmin.id,
    role: "admin",
  });

  const { password: _, ...adminWithoutPassword } = isExistAdmin;

  return {
    token: createToken,
    admin: adminWithoutPassword,
  };
};

// updated password
export const updatePasswordService = async (payload: any) => {
  const { id, oldPassword, newPassword } = payload;

  // check admin exist
  const isExistAdmin = await dbClient.admin.findUnique({
    where: { id: id },
  });
  if (!isExistAdmin) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Admin doesn't exist!");
  }

  // check admin password
  const isPasswordMatched = await bcrypt.compare(
    oldPassword,
    isExistAdmin.password,
  );

  // check admin password
  if (!isPasswordMatched) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      "Current password is incorrect!",
    );
  }

  //hash password
  const hashedPassword = await bcrypt.hash(
    newPassword,
    Number(config.bcrypt_salt_rounds),
  );

  // update admin password
  const result = await dbClient.admin.update({
    where: { id: id },
    data: {
      password: hashedPassword,
    },
    omit: {
      password: true,
    },
  });

  if (!result) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to update admin!");
  }

  return result;
};
