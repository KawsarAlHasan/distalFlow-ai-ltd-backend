import express, { NextFunction, Request, Response } from "express";
import validateRequest from "../../middlewares/validateRequest";
import { clinicAdminAuth } from "../../middlewares/auth";
import fileUploadHandler from "../../middlewares/fileUploadHandler";
import { createCampaignZod } from "./campaign.validation";
import {
  createCampaign,
  getAllCampaigns,
  getCampaignById,
} from "./campaign.controller";

const router = express.Router();

/**
 * Middleware to parse req.body.data if incoming request is multipart/form-data
 * with a JSON string payload, before running the Zod validation schema.
 */
const parseMultipartData = (req: Request, res: Response, next: NextFunction) => {
  if (req.body && typeof req.body.data === "string") {
    try {
      req.body = JSON.parse(req.body.data);
    } catch {
      // Let validateRequest or controller catch malformed JSON
    }
  }
  next();
};

router.post(
  "/create",
  clinicAdminAuth(),
  fileUploadHandler(),
  parseMultipartData,
  validateRequest(createCampaignZod),
  createCampaign,
);

router.get("/all", clinicAdminAuth(), getAllCampaigns);

router.get("/:id", getCampaignById);

export const CampaignRoutes = router;
