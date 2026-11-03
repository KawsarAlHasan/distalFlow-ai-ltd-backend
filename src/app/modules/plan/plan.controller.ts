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
  getAuditLogService,
} from "./plan.service";

// POST /plans/initialize
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

// GET /plans
export const getPlans = catchAsync(async (req: Request, res: Response) => {
  const result = await getPlansService();
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Plans retrieved successfully",
    data: result,
  });
});

// // POST /plans/:planType/prices
// export const createPrice = catchAsync(async (req: Request, res: Response) => {
//   const { planType } = req.params;
//   const { amount, setupFee } = req.body;
//   const admin = req.user?.name || "System";
//   const result = await createPriceService(planType, amount, setupFee, admin);
//   sendResponse(res, {
//     success: true,
//     statusCode: StatusCodes.CREATED,
//     message: "New price created successfully",
//     data: result,
//   });
// });

// // POST /plans/:planType/migrate
// export const migrateSubscribers = catchAsync(async (req: Request, res: Response) => {
//   const { planType } = req.params;
//   const { priceId, mode } = req.body;
//   const admin = req.user?.name || "System";
//   const result = await migrateSubscribersService(planType, priceId, mode, admin);
//   sendResponse(res, {
//     success: true,
//     statusCode: StatusCodes.OK,
//     message: "Migration completed",
//     data: result,
//   });
// });

// // GET /plans/overrides
// export const getOverrides = catchAsync(async (req: Request, res: Response) => {
//   const result = await getOverridesService();
//   sendResponse(res, {
//     success: true,
//     statusCode: StatusCodes.OK,
//     message: "Overrides retrieved",
//     data: result,
//   });
// });

// // POST /plans/overrides
// export const createOverride = catchAsync(async (req: Request, res: Response) => {
//   const { clinicName, tier, overridePrice, reason } = req.body;
//   const admin = req.user?.name || "System";
//   const result = await createOverrideService(clinicName, tier, overridePrice, reason, admin);
//   sendResponse(res, {
//     success: true,
//     statusCode: StatusCodes.CREATED,
//     message: "Override applied",
//     data: result,
//   });
// });

// // GET /plans/audit-log
// export const getAuditLog = catchAsync(async (req: Request, res: Response) => {
//   const result = await getAuditLogService();
//   sendResponse(res, {
//     success: true,
//     statusCode: StatusCodes.OK,
//     message: "Audit log retrieved",
//     data: result,
//   });
// });
