import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import ApiError from "../../errors/ApiError";
import { verifyAuthToken } from "../../helpers/jwtHelper";
import { dbClient } from "../../lib/prisma";

type AuthOptions = {
  checkStatus?: boolean;
  checkApproval?: boolean;
};

// verify admin
export const adminAuth = () => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers?.authorization?.split(" ")?.[1];
      if (!token) {
        throw new ApiError(StatusCodes.UNAUTHORIZED, "You are not authorized");
      }

      const decoded = verifyAuthToken(token, "admin");

      // get admin from db
      const admin = await dbClient.admin.findUnique({
        where: {
          id: decoded.id,
        },
        omit: {
          password: true,
        },
      });

      if (!admin) {
        throw new ApiError(
          StatusCodes.UNAUTHORIZED,
          "No admin found. Please login again",
        );
      }

      if (admin.status !== "ACTIVE") {
        throw new ApiError(
          StatusCodes.UNAUTHORIZED,
          "Your account is not active. Please contact support",
        );
      }

      (req as any).decodedAdmin = admin;
      next();
    } catch (error: any) {
      next(error);
    }
  };
};

// verify user
export const userAuth = (options: AuthOptions = {}) => {
  const { checkStatus = true } = options;
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers?.authorization?.split(" ")?.[1];
      if (!token) {
        throw new ApiError(StatusCodes.UNAUTHORIZED, "You are not authorized");
      }

      const decoded = verifyAuthToken(token, "user");

      // get user from db
      const user = await dbClient.user.findUnique({
        where: {
          id: decoded.id,
        },
        omit: {
          password: true,
        },
      });

      if (!user) {
        throw new ApiError(
          StatusCodes.UNAUTHORIZED,
          "No user found. Please login again",
        );
      }

      // check Status
      if (checkStatus) {
        if (user.status !== "ACTIVE") {
          throw new ApiError(
            StatusCodes.UNAUTHORIZED,
            `Your account is ${user.status}! Please contact support`,
          );
        }

        if (user.isVerified === false) {
          throw new ApiError(
            StatusCodes.UNAUTHORIZED,
            "Your account is not verified. Please verify your account first",
          );
        }
      }

      (req as any).decodedUser = user;
      next();
    } catch (error: any) {
      next(error);
    }
  };
};

// verify clinic admin
export const clinicAdminAuth = (checkMainClient = false) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers?.authorization?.split(" ")?.[1];
      if (!token) {
        throw new ApiError(StatusCodes.UNAUTHORIZED, "You are not authorized");
      }

      const decoded = verifyAuthToken(token, "clinic_admin");

      // get clinic admin from db
      const clinicAdmin = await dbClient.clinicAdmin.findUnique({
        where: {
          id: decoded.id,
        },
        omit: {
          password: true,
        },
      });

      if (!clinicAdmin) {
        throw new ApiError(
          StatusCodes.UNAUTHORIZED,
          "No clinic admin found. Please login again",
        );
      }

      if (clinicAdmin.status !== "ACTIVE") {
        throw new ApiError(
          StatusCodes.UNAUTHORIZED,
          "Your account is not active. Please contact support",
        );
      }

      if (clinicAdmin.isVerified === false) {
        throw new ApiError(
          StatusCodes.UNAUTHORIZED,
          "Your account is not verified. Please verify your account first",
        );
      }

      // check main client
      if (checkMainClient && clinicAdmin.isMainAdmin === false) {
        throw new ApiError(
          StatusCodes.FORBIDDEN,
          "You don't have permission to access this api",
        );
      }

      let currentSubscription = null;
      // if (clinicAdmin.companyId) {
      //   currentSubscription = await dbClient.subscriptions.findFirst({
      //     where: { companyId: client.companyId, status: "ACTIVE" },
      //     include: {
      //       plan: true,
      //     },
      //   });
      // }

      (req as any).decodedClinicAdmin = {
        ...clinicAdmin,
        mySubscription: currentSubscription,
      };
      next();
    } catch (error: any) {
      next(error);
    }
  };
};

// verify rig admin
export const rigAdminAuth = (checkMainClient = false) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers?.authorization?.split(" ")?.[1];
      if (!token) {
        throw new ApiError(StatusCodes.UNAUTHORIZED, "You are not authorized");
      }

      const decoded = verifyAuthToken(token, "rig_admin");

      // get client from db
      const client = await dbClient.client.findUnique({
        where: {
          id: decoded.id,
        },
      });

      if (!client) {
        throw new ApiError(
          StatusCodes.UNAUTHORIZED,
          "No client found. Please login again",
        );
      }

      if (client.status !== "ACTIVE") {
        throw new ApiError(
          StatusCodes.UNAUTHORIZED,
          "Your account is not active. Please contact support",
        );
      }

      if (client.isVerified === false) {
        throw new ApiError(
          StatusCodes.UNAUTHORIZED,
          "Your account is not verified. Please verify your account first",
        );
      }

      // check main client
      if (checkMainClient && client.isMainClient === false) {
        throw new ApiError(
          StatusCodes.FORBIDDEN,
          "You don't have permission to access this api",
        );
      }

      (req as any).decodedClient = client;
      next();
    } catch (error: any) {
      next(error);
    }
  };
};
