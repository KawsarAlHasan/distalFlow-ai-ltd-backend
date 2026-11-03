import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import {
  googleCallbackRedirectService,
  googleConnectAdsAccountService,
} from "./settings.service";

// google ads account connect
export const googleConnectAdsAccount = catchAsync(
  async (req: Request, res: Response) => {
    const clinicId = (req as any).decodedClinicAdmin.clinicId;

    const result = await googleConnectAdsAccountService(clinicId);
    // return res.redirect(result);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Google OAuth URL generated",
      data: result,
    });
  },
);

import config from "../../../config";

// google callback redirect
export const googleCallbackRedirect = catchAsync(
  async (req: Request, res: Response) => {
    await googleCallbackRedirectService(req.query);

    res.redirect(
      `${config.FRONTEND_BASE_URL}/integrations?status=success&provider=google`,
    );
  },
);
