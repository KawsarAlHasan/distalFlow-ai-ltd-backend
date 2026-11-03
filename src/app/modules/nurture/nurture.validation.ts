import { z } from "zod";

export const createNurtureSequenceZod = z.object({
  body: z.object({
    name: z.string().min(1, "Sequence name cannot be empty"),
    campaignId: z.string().optional().nullable(),
    template: z.enum(["treatment", "blank"] as const).optional(),
  }),
});

export const updateNurtureSequenceZod = z.object({
  body: z.object({
    name: z.string().min(1, "Sequence name cannot be empty").optional(),
    active: z.boolean().optional(),
    campaignId: z.string().optional().nullable(),
  }),
});

export const createNurtureStepZod = z.object({
  body: z.object({
    sequenceId: z.string().min(1, "Sequence ID is required"),
    channel: z.enum(["sms", "email", "wa"] as const),
    wait: z.coerce.number().int().min(0, "Wait must be 0 or greater"),
    unit: z.enum(["days", "hours"] as const),
    message: z.string().min(1, "Message cannot be empty"),
    badge: z.string().optional().nullable(),
    order: z.coerce.number().int().optional(),
  }),
});

export const updateNurtureStepZod = z.object({
  body: z.object({
    channel: z.enum(["sms", "email", "wa"] as const).optional(),
    wait: z.coerce.number().int().min(0, "Wait must be 0 or greater").optional(),
    unit: z.enum(["days", "hours"] as const).optional(),
    message: z.string().min(1, "Message cannot be empty").optional(),
    badge: z.string().optional().nullable(),
    order: z.coerce.number().int().optional(),
  }),
});
