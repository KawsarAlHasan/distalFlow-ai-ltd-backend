import { StatusCodes } from "http-status-codes";
import ApiError from "../../../errors/ApiError";
import { dbClient } from "../../../lib/prisma";
import * as adsService from '../../../services/googleAdsService';

// customer list for accessable for users
export const customerListService = async (clinicId: any) => {

    const clinic = await dbClient.clinic.findUnique({
        where: { id: clinicId },
    });

    if (!clinic) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Clinic doesn't exist!");
    }

    if (!clinic.refreshToken) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Refresh token doesn't exist!");
    }

    const customers = await adsService.getAccessibleCustomers(clinic.refreshToken);

    return customers;
};

// select customer
export const selectCustomerService = async (payload: any) => {
    const { customerId, clinicId } = payload;


    const clinic = await dbClient.clinic.findUnique({
        where: { id: clinicId },
    });

    if (!clinic) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Clinic doesn't exist!");
    }

    // update selected customer on clinic table
    const updatedClinic = await dbClient.clinic.update({
        where: { id: clinicId },
        data: { selectedCustomerId: customerId },
    });

    return updatedClinic;
};

// create campain
export const createCampainService = async (payload: any) => {
    const { clinicId, name, budget } = payload;

    console.log("payload", clinicId, name, budget);


    const clinic = await dbClient.clinic.findUnique({
        where: { id: clinicId },
    });

    console.log("clinic", clinic);


    if (!clinic) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Clinic doesn't exist!");
    }


    if (!clinic.refreshToken) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Refresh token doesn't exist!");
    }

    if (!clinic.selectedCustomerId) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Selected customer doesn't exist!");
    }

    const customerClient = adsService.getCustomerClient(
        clinic.selectedCustomerId,
        clinic.refreshToken
    );

    console.log("customerClient", customerClient);


    const campaign = await adsService.createSearchCampaign(customerClient, {
        name: name || 'My Prisma Campaign',
        budget: budget || 10,
    });

    console.log("campaign", campaign);

    return campaign;
};
