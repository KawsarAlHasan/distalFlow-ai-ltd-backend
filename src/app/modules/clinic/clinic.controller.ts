import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import {
  clinicCreateService,
  getAllClinicsService,
  getClinicByIdService,
  updateClinicStatusService,
} from "./clinic.service";

// create new Clinic
export const createNewClinic = catchAsync(
  async (req: Request, res: Response) => {
    const { ...payload } = req.body;

    const result = await clinicCreateService(payload);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Clinic created successfully",
      data: result,
    });
  },
);

// get all Clinics with search, status filters & pagination
export const getAllClinics = catchAsync(
  async (req: Request, res: Response) => {
    const result = await getAllClinicsService(req.query);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Clinics fetched successfully",
      data: result,
    });
  },
);

// get single Clinic details by ID
export const getClinicById = catchAsync(
  async (req: Request, res: Response) => {
    const clinicId = req.params.id as string;
    const result = await getClinicByIdService(clinicId);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Clinic details fetched successfully",
      data: result,
    });
  },
);

// update Clinic status (ACTIVE, SUSPENDED, PENDING, INACTIVE)
export const updateClinicStatus = catchAsync(
  async (req: Request, res: Response) => {
    const clinicId = req.params.id as string;
    const { status } = req.body;

    const result = await updateClinicStatusService(clinicId, status);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: `Clinic status updated to ${status} successfully`,
      data: result,
    });
  },
);
