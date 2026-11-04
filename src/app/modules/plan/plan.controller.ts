import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import {
  initializePlanService,
  getPlansService,
  createPriceService,
  migrateSubscribersService,
  getOverridesService,
  createOverrideService,
  deleteOverrideService,
  getAuditLogService,
} from "./plan.service";

// POST /plan/initialize
export const initializePlan = catchAsync(
  async (req: Request, res: Response) => {
    const result = await initializePlanService();
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Plans initialized successfully",
      data: result,
    });
  },
);

// GET /plan
export const getPlans = catchAsync(async (req: Request, res: Response) => {
  const result = await getPlansService();
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Plans retrieved successfully",
    data: result,
  });
});

// POST /plan/:planType/prices
export const createPrice = catchAsync(async (req: Request, res: Response) => {
  const planType = req.params.planType as string;
  const { amount, setupFee } = req.body;
  const admin = (req as any).decodedAdmin?.name || (req as any).user?.name || "Admin";
  const result = await createPriceService(planType, Number(amount), Number(setupFee || 0), admin);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.CREATED,
    message: "New price created successfully",
    data: result,
  });
});

// POST /plan/:planType/migrate
export const migrateSubscribers = catchAsync(async (req: Request, res: Response) => {
  const planType = req.params.planType as string;
  const { priceId, mode } = req.body;
  const admin = (req as any).decodedAdmin?.name || (req as any).user?.name || "Admin";
  const result = await migrateSubscribersService(planType, priceId, mode, admin);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Migration completed successfully",
    data: result,
  });
});

// GET /plan/overrides
export const getOverrides = catchAsync(async (req: Request, res: Response) => {
  const result = await getOverridesService();
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Overrides retrieved successfully",
    data: result,
  });
});

// POST /plan/overrides
export const createOverride = catchAsync(async (req: Request, res: Response) => {
  const { clinicName, tier, overridePrice, reason } = req.body;
  const admin = (req as any).decodedAdmin?.name || (req as any).user?.name || "Admin";
  const result = await createOverrideService(clinicName, tier, Number(overridePrice), reason, admin);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.CREATED,
    message: "Override applied successfully",
    data: result,
  });
});

// DELETE /plan/overrides/:id
export const deleteOverride = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const admin = (req as any).decodedAdmin?.name || (req as any).user?.name || "Admin";
  const result = await deleteOverrideService(id, admin);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Override removed successfully",
    data: result,
  });
});

// GET /plan/audit-log
export const getAuditLog = catchAsync(async (req: Request, res: Response) => {
  const result = await getAuditLogService();
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Audit log retrieved successfully",
    data: result,
  });
});
