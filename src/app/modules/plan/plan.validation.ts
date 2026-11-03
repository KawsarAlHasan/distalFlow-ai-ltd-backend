import { z } from "zod";

export const initioalPlanZodSchema = z.object({
  body: z.object({
   
  }),
});

export const updatePlanZodSchema = z.object({
  body: z.object({
    id: z.string().min(1, "Id is required"),
    amount: z.number().min(1, "Price is required"),
    setupFee: z.number().min(1, "Setup fee is required"),
  }),
});
