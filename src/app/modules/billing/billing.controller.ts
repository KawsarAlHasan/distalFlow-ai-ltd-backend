import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import {
  getAdminBillingOverviewService,
  retryClinicPaymentService,
  exportBillingStatementService,
  getClinicBillingService,
  changeClinicPlanService,
  requestEnterpriseSalesService,
  updateBillingContactService,
  updatePaymentMethodService,
  createStripePortalSessionService,
} from "./billing.service";

// ---------------------------------------------------------------------------
// ADMIN CONTROLLERS
// ---------------------------------------------------------------------------

export const getAdminBillingOverview = catchAsync(async (req: Request, res: Response) => {
  const result = await getAdminBillingOverviewService();
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Admin billing overview fetched successfully",
    data: result,
  });
});

export const retryClinicPayment = catchAsync(async (req: Request, res: Response) => {
  const clinicId = req.params.clinicId as string;
  const result = await retryClinicPaymentService(clinicId);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: result.message,
    data: result,
  });
});

export const exportBillingStatement = catchAsync(async (req: Request, res: Response) => {
  const result = await exportBillingStatementService();
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Billing statement generated successfully",
    data: result,
  });
});

// ---------------------------------------------------------------------------
// CLINIC CONTROLLERS
// ---------------------------------------------------------------------------

export const getClinicBilling = catchAsync(async (req: Request, res: Response) => {
  const clinicAdminId = (req as any).decodedClinicAdmin?.id;
  const result = await getClinicBillingService(clinicAdminId);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Clinic billing data retrieved successfully",
    data: result,
  });
});

export const changeClinicPlan = catchAsync(async (req: Request, res: Response) => {
  const clinicAdminId = (req as any).decodedClinicAdmin?.id;
  const result = await changeClinicPlanService(clinicAdminId, req.body);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Subscription plan updated successfully",
    data: result,
  });
});

export const requestEnterpriseSales = catchAsync(async (req: Request, res: Response) => {
  const clinicAdminId = (req as any).decodedClinicAdmin?.id;
  const result = await requestEnterpriseSalesService(clinicAdminId, req.body);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: result.message,
    data: result,
  });
});

export const updateBillingContact = catchAsync(async (req: Request, res: Response) => {
  const clinicAdminId = (req as any).decodedClinicAdmin?.id;
  const result = await updateBillingContactService(clinicAdminId, req.body);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Billing contact details updated successfully",
    data: result,
  });
});

export const updatePaymentMethod = catchAsync(async (req: Request, res: Response) => {
  const clinicAdminId = (req as any).decodedClinicAdmin?.id;
  const result = await updatePaymentMethodService(clinicAdminId, req.body);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Payment method updated successfully",
    data: result,
  });
});

export const createStripePortalSession = catchAsync(async (req: Request, res: Response) => {
  const clinicAdminId = (req as any).decodedClinicAdmin?.id;
  const result = await createStripePortalSessionService(clinicAdminId);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Stripe portal session created",
    data: result,
  });
});
