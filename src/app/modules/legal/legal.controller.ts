import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import {
  getAdminDocumentsService,
  getDocumentByIdService,
  createDocumentVersionService,
  updateDocumentService,
  publishDocumentVersionService,
  getClinicAcceptancesService,
  getActiveDocumentService,
  getMyAgreementsService,
  getAcceptanceStatusService,
  acceptLegalAgreementsService,
} from "./legal.service";
import { LegalDocumentType } from "../../../../generated/prisma/client";

// ---------------------------------------------------------------------------
// ADMIN CONTROLLERS
// ---------------------------------------------------------------------------

export const getAdminDocuments = catchAsync(async (req: Request, res: Response) => {
  const type = (req.query.type as LegalDocumentType) || LegalDocumentType.TERMS_OF_SERVICE;
  const result = await getAdminDocumentsService(type);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: `${type} documents retrieved successfully`,
    data: result,
  });
});

export const getDocumentById = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const result = await getDocumentByIdService(id);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Document retrieved successfully",
    data: result,
  });
});

export const createDocumentVersion = catchAsync(async (req: Request, res: Response) => {
  const adminId = (req as any).decodedAdmin?.id;
  const result = await createDocumentVersionService(req.body, adminId);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.CREATED,
    message: "New legal document version created successfully",
    data: result,
  });
});

export const updateDocument = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const result = await updateDocumentService(id, req.body);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Document updated successfully",
    data: result,
  });
});

export const publishDocumentVersion = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const adminId = (req as any).decodedAdmin?.id;
  const result = await publishDocumentVersionService(id, adminId);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Document version published and set as ACTIVE successfully",
    data: result,
  });
});

export const getClinicAcceptances = catchAsync(async (req: Request, res: Response) => {
  const type = req.query.type as LegalDocumentType | undefined;
  const result = await getClinicAcceptancesService(type);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Clinic legal acceptances retrieved successfully",
    data: result,
  });
});

// ---------------------------------------------------------------------------
// PUBLIC & CLINIC ADMIN CONTROLLERS
// ---------------------------------------------------------------------------

export const getActiveDocument = catchAsync(async (req: Request, res: Response) => {
  const type = (req.query.type as LegalDocumentType) || LegalDocumentType.TERMS_OF_SERVICE;
  const result = await getActiveDocumentService(type);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: `Active ${type} document retrieved successfully`,
    data: result,
  });
});

export const getMyAgreements = catchAsync(async (req: Request, res: Response) => {
  const clinicAdminId = (req as any).decodedClinicAdmin?.id;
  const type = req.query.type as LegalDocumentType | undefined;
  const result = await getMyAgreementsService(clinicAdminId, type);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Clinic legal agreements retrieved successfully",
    data: result,
  });
});

export const getAcceptanceStatus = catchAsync(async (req: Request, res: Response) => {
  const clinicAdminId = (req as any).decodedClinicAdmin?.id;
  const result = await getAcceptanceStatusService(clinicAdminId);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Acceptance status checked successfully",
    data: result,
  });
});

export const acceptLegalAgreements = catchAsync(async (req: Request, res: Response) => {
  const clinicAdminId = (req as any).decodedClinicAdmin?.id;
  const { termsDocumentId, privacyDocumentId } = req.body;
  const reqInfo = {
    ip: (req.headers["x-forwarded-for"] as string) || req.socket.remoteAddress,
    userAgent: req.headers["user-agent"],
  };

  const result = await acceptLegalAgreementsService(
    clinicAdminId,
    termsDocumentId,
    privacyDocumentId,
    reqInfo,
  );

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: result.message,
    data: result,
  });
});

