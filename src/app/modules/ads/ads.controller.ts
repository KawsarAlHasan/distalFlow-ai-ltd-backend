import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { createCampainService, customerListService, selectCustomerService } from "./ads.service";


// get google customers
export const getGoogleCustomers = catchAsync(async (req: Request, res: Response) => {

    const clinicId = (req as any).decodedClinicAdmin.clinicId;

    const result = await customerListService(clinicId);

    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: "Google customers fetched successfully",
        data: result,
    });
});

// select google customer
export const selectGoogleCustomer = catchAsync(
    async (req: Request, res: Response) => {
        const clinicId = (req as any).decodedClinicAdmin.clinicId;

        const { customerId } = req.body;

        const result = await selectCustomerService({ clinicId, customerId });

        sendResponse(res, {
            success: true,
            statusCode: StatusCodes.OK,
            message: "Selected google customer successfully",
            data: result,
        });
    },
);

// create campaign
export const createCampaign = catchAsync(
    async (req: Request, res: Response) => {
        const clinicId = (req as any).decodedClinicAdmin.clinicId;

        const { name, budget } = req.body;

        console.log(clinicId, name, budget, "rrrrrrrrr");


        const result = await createCampainService({ clinicId, name, budget });

        console.log(result, "ressssssss");


        sendResponse(res, {
            success: true,
            statusCode: StatusCodes.OK,
            message: "Campaign created successfully",
            data: result,
        });
    },
);
