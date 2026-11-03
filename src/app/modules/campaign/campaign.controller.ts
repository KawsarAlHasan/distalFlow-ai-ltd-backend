import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import ApiError from "../../../errors/ApiError";
import {
  createCampaignsService,
  getAllCampaignsService,
  getCampaignByIdService,
} from "./campaign.service";

// -----------------------------------------------------------------------------
// Create Campaign Controller
// -----------------------------------------------------------------------------
export const createCampaign = catchAsync(
  async (req: Request, res: Response) => {
    const clinicAdmin = (req as any).decodedClinicAdmin;

    if (!clinicAdmin) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, "Clinic admin is not authenticated!");
    }

    // Support both multipart parsed JSON (e.g., req.body.data) and normal application/json
    let bodyData = { ...req.body };
    if (typeof req.body?.data === "string") {
      try {
        bodyData = JSON.parse(req.body.data);
      } catch (err) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid JSON data provided!");
      }
    }

    // Extract uploaded files if provided via multipart/form-data
    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;

    let doctorImageUrl = bodyData.doctorImageUrl;
    let logoUrl = bodyData.logoUrl;
    let videoUrl = bodyData.videoUrl;
    let videoPosterUrl = bodyData.videoPosterUrl;
    let sourceVideoName = bodyData.sourceVideoName;
    let sourceVideoSize = bodyData.sourceVideoSize;

    if (files) {
      // 1. Doctor photo
      if (files["doctorImage"]?.[0]) {
        doctorImageUrl = `${baseUrl}/images/${files["doctorImage"][0].filename}`;
      } else if (files["image"]?.[0]) {
        doctorImageUrl = `${baseUrl}/images/${files["image"][0].filename}`;
      }

      // 2. Clinic logo
      if (files["logo"]?.[0]) {
        logoUrl = `${baseUrl}/images/${files["logo"][0].filename}`;
      }

      // 3. Video Poster
      if (files["videoPoster"]?.[0]) {
        videoPosterUrl = `${baseUrl}/images/${files["videoPoster"][0].filename}`;
      } else if (files["poster"]?.[0]) {
        videoPosterUrl = `${baseUrl}/images/${files["poster"][0].filename}`;
      }

      // 4. Video media
      const videoFile = files["video"]?.[0] || files["media"]?.[0];
      if (videoFile) {
        videoUrl = `${baseUrl}/medias/${videoFile.filename}`;
        sourceVideoName = videoFile.originalname;
        sourceVideoSize = videoFile.size;
      }
    }

    const payload = {
      ...bodyData,
      ...(doctorImageUrl !== undefined && { doctorImageUrl }),
      ...(logoUrl !== undefined && { logoUrl }),
      ...(videoUrl !== undefined && {
        videoUrl,
        sourceVideoUrl: videoUrl,
      }),
      ...(videoPosterUrl !== undefined && { videoPosterUrl }),
      ...(sourceVideoName !== undefined && { sourceVideoName }),
      ...(sourceVideoSize !== undefined && { sourceVideoSize }),
      clinicId: clinicAdmin.clinicId || clinicAdmin.id,
    };

    const result = await createCampaignsService(payload);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: "Campaign created successfully",
      data: result,
    });
  },
);

// -----------------------------------------------------------------------------
// Get All Campaigns for Authenticated Clinic
// -----------------------------------------------------------------------------
export const getAllCampaigns = catchAsync(
  async (req: Request, res: Response) => {
    const clinicAdmin = (req as any).decodedClinicAdmin;
    const clinicId = clinicAdmin.clinicId || clinicAdmin.id;

    const result = await getAllCampaignsService(clinicId);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Campaigns retrieved successfully",
      data: result,
    });
  },
);

// -----------------------------------------------------------------------------
// Get Single Campaign by ID
// -----------------------------------------------------------------------------
export const getCampaignById = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;

    const result = await getCampaignByIdService(id);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Campaign retrieved successfully",
      data: result,
    });
  },
);
