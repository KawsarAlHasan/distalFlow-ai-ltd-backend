import { z } from "zod";

export const selectGoogleCustomerZodSchema = z.object({
    body: z.object({
        customerId: z.string().min(1, "Customer id is required"),
    }),
});

export const createCampaignZodSchema = z.object({
    body: z.object({
        name: z.string().min(1, "Name is required"),
        budget: z.number().min(1, "Budget is required"),
    }),
});
