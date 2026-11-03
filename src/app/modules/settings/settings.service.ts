import { StatusCodes } from "http-status-codes";
import ApiError from "../../../errors/ApiError";
import { dbClient } from "../../../lib/prisma";
import config from "../../../config";
import { google } from 'googleapis';
import axios from "axios";

const oauth2Client = new google.auth.OAuth2(
    config.google.client_id!,
    config.google.client_secret!,
    config.google.redirect_uri!
);

// Google Connect for ads Account
export const googleConnectAdsAccountService = async (clinicId: string) => {
    const url = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        prompt: 'consent',
        state: clinicId,
        scope: [
            'https://www.googleapis.com/auth/adwords',
            'https://www.googleapis.com/auth/userinfo.email',
            'https://www.googleapis.com/auth/userinfo.profile',
        ],
        redirect_uri: config.google.redirect_uri,
    });

    return url;
};

// google callback redirect handle
export const googleCallbackRedirectService = async (payload: any) => {
    const { code, state } = payload;

    if (!code || typeof code !== 'string') {
        throw new ApiError(StatusCodes.BAD_REQUEST, "No code provided");
    }

    const { tokens } = await oauth2Client.getToken(code);

    oauth2Client.setCredentials(tokens);
    const userInfo = await axios.get<{ id: string; email: string; name: string }>(
        'https://www.googleapis.com/oauth2/v2/userinfo',
        {
            headers: { Authorization: `Bearer ${tokens.access_token}` },
        }
    );

    const clinicId = state;

    if (!clinicId || typeof clinicId !== 'string') {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid state (clinicId) provided");
    }

    const clinic = await dbClient.clinic.update({
        where: { id: clinicId },
        data: {
            googleId: userInfo.data.id,
            googleEmail: userInfo.data.email,
            // Only update refreshToken if we get a new one from Google
            ...(tokens.refresh_token && { refreshToken: tokens.refresh_token })
        },
    });

    return clinic;
};
