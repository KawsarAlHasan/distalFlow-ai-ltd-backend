import { StatusCodes } from "http-status-codes";
import bcrypt from "bcrypt";
import ApiError from "../../../errors/ApiError";
import { dbClient } from "../../../lib/prisma";
import config from "../../../config";
import unlinkFile from "../../../shared/unlinkFile";
import { Prisma } from "../../../../generated/prisma/client";

// create new Admin
export const adminCreateService = async (adminData: any) => {
  const { name, email, password, phone, roleName } = adminData;

  // check if email already exists
  const isExistEmail = await dbClient.admin.findUnique({
    where: { email },
  });

  // check if email already exists
  if (isExistEmail) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Email already exists!");
  }

  //hash password
  const hashedPassword = await bcrypt.hash(
    password,
    Number(config.bcrypt_salt_rounds),
  );

  // create admin
  const result = await dbClient.admin.create({
    data: {
      name,
      email,
      phone,
      roleName,
      password: hashedPassword,
    },
    omit: {
      password: true,
    },
  });

  // check admin creation
  if (!result) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to create admin!");
  }

  return result;
};

// get all Admin
export const getAllAdminService = async (query: any) => {
  const andConditions: Prisma.AdminWhereInput[] = [];

  // Status filter
  if (!query.status) {
    andConditions.push({
      NOT: {
        status: "DELETED",
      },
    });
  } else {
    andConditions.push({
      status: query.status,
    });
  }

  const whereCondition: Prisma.AdminWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await dbClient.admin.findMany({
    where: whereCondition,
    orderBy: {
      id: "desc",
    },
    omit: {
      password: true,
    },
  });

  // check admin creation
  if (!result) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to fetch admin!");
  }

  // check if no admin
  if (result.length === 0) {
    throw new ApiError(StatusCodes.NOT_FOUND, "No admins found!");
  }

  return result;
};

// Update an existing Admin
export const updateAdminService = async (adminData: any) => {
  const { id, name, phone, roleName } = adminData;

  // check Admin exist
  const isExistAdmin = await dbClient.admin.findUnique({
    where: { id: id },
  });
  if (!isExistAdmin) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Admin doesn't exist!");
  }

  // update Admin
  const result = await dbClient.admin.update({
    where: { id: id },
    data: {
      name: name,
      phone: phone,
      roleName: roleName,
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

// Status change
export const adminStatusChangeService = async (adminData: any) => {
  const { id, status } = adminData;

  // check Admin exist
  const isExistAdmin = await dbClient.admin.findUnique({
    where: { id: id },
  });
  if (!isExistAdmin) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Admin doesn't exist!");
  }

  // update Admin
  const result = await dbClient.admin.update({
    where: { id: id },
    data: {
      status: status,
    },
    omit: {
      password: true,
    },
  });

  if (!result) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to Status change!");
  }

  return result;
};

// Delete an existing Admin
export const deleteAdminService = async (adminId: any) => {
  // check Admin exist
  const isExistAdmin = await dbClient.admin.findUnique({
    where: { id: adminId },
  });
  if (!isExistAdmin) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Admin doesn't exist!");
  }

  // delete image
  if (isExistAdmin.profilePic) {
    unlinkFile(isExistAdmin.profilePic);
  }

  // delete Admin
  const result = await dbClient.admin.delete({
    where: { id: adminId },
  });

  if (!result) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to delete admin!");
  }
};
