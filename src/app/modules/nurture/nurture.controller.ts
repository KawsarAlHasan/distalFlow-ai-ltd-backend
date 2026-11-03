import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import ApiError from "../../../errors/ApiError";
import {
  createNurtureSequenceService,
  getNurtureSequencesService,
  getNurtureSequenceByIdService,
  updateNurtureSequenceService,
  deleteNurtureSequenceService,
  addNurtureStepService,
  updateNurtureStepService,
  deleteNurtureStepService,
} from "./nurture.service";

// Helper to extract clinicId from authenticated request
const getClinicId = (req: Request): string => {
  const clinicAdmin = (req as any).decodedClinicAdmin;
  if (!clinicAdmin) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, "Clinic admin is not authenticated");
  }
  return clinicAdmin.clinicId || clinicAdmin.id;
};

// -----------------------------------------------------------------------------
// Sequence Controllers
// -----------------------------------------------------------------------------

// 1. Create nurture sequence
export const createNurtureSequence = catchAsync(
  async (req: Request, res: Response) => {
    const clinicId = getClinicId(req);

    const payload = {
      ...req.body,
      clinicId,
    };

    const result = await createNurtureSequenceService(payload);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: "Nurture sequence created successfully",
      data: result,
    });
  },
);

// 2. Get all nurture sequences for clinic
export const getAllNurtureSequences = catchAsync(
  async (req: Request, res: Response) => {
    const clinicId = getClinicId(req);

    const result = await getNurtureSequencesService(clinicId);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Nurture sequences retrieved successfully",
      data: result,
    });
  },
);

// 3. Get single nurture sequence by ID
export const getNurtureSequenceById = catchAsync(
  async (req: Request, res: Response) => {
    const clinicId = getClinicId(req);
    const id = req.params.id as string;

    const result = await getNurtureSequenceByIdService(id, clinicId);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Nurture sequence retrieved successfully",
      data: result,
    });
  },
);

// 4. Update nurture sequence
export const updateNurtureSequence = catchAsync(
  async (req: Request, res: Response) => {
    const clinicId = getClinicId(req);
    const id = req.params.id as string;

    const result = await updateNurtureSequenceService(id, clinicId, req.body);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Nurture sequence updated successfully",
      data: result,
    });
  },
);

// 5. Delete nurture sequence
export const deleteNurtureSequence = catchAsync(
  async (req: Request, res: Response) => {
    const clinicId = getClinicId(req);
    const id = req.params.id as string;

    const result = await deleteNurtureSequenceService(id, clinicId);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Nurture sequence deleted successfully",
      data: result,
    });
  },
);

// -----------------------------------------------------------------------------
// Step Controllers
// -----------------------------------------------------------------------------

// 6. Add step to sequence
export const addNurtureStep = catchAsync(
  async (req: Request, res: Response) => {
    const clinicId = getClinicId(req);

    const result = await addNurtureStepService(clinicId, req.body);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: "Nurture step added successfully",
      data: result,
    });
  },
);

// 7. Update nurture step
export const updateNurtureStep = catchAsync(
  async (req: Request, res: Response) => {
    const clinicId = getClinicId(req);
    const id = req.params.id as string;

    const result = await updateNurtureStepService(id, clinicId, req.body);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Nurture step updated successfully",
      data: result,
    });
  },
);

// 8. Delete nurture step
export const deleteNurtureStep = catchAsync(
  async (req: Request, res: Response) => {
    const clinicId = getClinicId(req);
    const id = req.params.id as string;

    const result = await deleteNurtureStepService(id, clinicId);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Nurture step deleted successfully",
      data: result,
    });
  },
);
