import { StatusCodes } from "http-status-codes";
import bcrypt from "bcrypt";
import ApiError from "../../../errors/ApiError";
import { dbClient } from "../../../lib/prisma";
import config from "../../../config";
import generateOTP from "../../../util/generateOTP";
import { resetPasswordEmail } from "../../../shared/emailTemplate";
import { emailHelper } from "../../../helpers/emailHelper";
import { createAuthToken } from "../../../helpers/jwtHelper";
import unlinkFile from "../../../shared/unlinkFile";

// ------------------------------
// Template steps (kept in sync with the frontend's TEMPLATE_STEPS)
// ------------------------------
const TREATMENT_TEMPLATE_STEPS = [
    {
        channel: "sms" as const,
        wait: 0,
        unit: "days" as const,
        message:
            "Hi {name}, thanks for your enquiry with Bright Smile. We'll call you shortly — or reply here with any questions.",
        order: 0,
    },
    {
        channel: "email" as const,
        wait: 1,
        unit: "days" as const,
        message: '"What to expect" — patient stories + finance options.',
        order: 1,
    },
    {
        channel: "sms" as const,
        wait: 2,
        unit: "days" as const,
        message: "Still thinking it over, {name}? Here's that booking link once more.",
        order: 2,
    },
];

// ------------------------------
// Types
// ------------------------------
interface CreateNurtureSequencePayload {
    name: string;
    campaignId?: string;
    clinicId: string;
    template?: "treatment" | "blank";
}

// ------------------------------
// Create Nurture Sequence
// ------------------------------
export const createNurtureSequenceService = async (
    payload: CreateNurtureSequencePayload,
) => {
    const { name, campaignId, clinicId, template } = payload;

    if (!name || !clinicId) {
        throw new Error("name and clinicId are required");
    }

    // sequence + steps together inside a transaction — if step creation fails, the sequence isn't created either
    const result = await dbClient.$transaction(async (tx) => {
        const nurtureSequence = await tx.nurtureSequence.create({
            data: {
                name,
                clinicId,
                campaignId: campaignId || undefined,
            },
        });

        if (template === "treatment") {
            await tx.nurtureStep.createMany({
                data: TREATMENT_TEMPLATE_STEPS.map((step) => ({
                    sequenceId: nurtureSequence.id,
                    channel: step.channel,
                    wait: step.wait,
                    unit: step.unit,
                    message: step.message,
                    order: step.order,
                })),
            });
        }

        // return the full sequence with its steps, sorted by order
        const sequenceWithSteps = await tx.nurtureSequence.findUnique({
            where: { id: nurtureSequence.id },
            include: {
                steps: {
                    orderBy: { order: "asc" },
                },
            },
        });

        return sequenceWithSteps;
    });

    return result;
};

// ------------------------------
// Get all sequences (with steps) for a clinic
// ------------------------------
export const getNurtureSequencesService = async (clinicId: string) => {
    return dbClient.nurtureSequence.findMany({
        where: { clinicId },
        include: {
            steps: {
                orderBy: { order: "asc" },
            },
        },
        orderBy: { createdAt: "asc" },
    });
};

// ------------------------------
// Update sequence (name / active)
// ------------------------------
interface UpdateNurtureSequencePayload {
    id: string;
    name?: string;
    active?: boolean;
}

export const updateNurtureSequenceService = async (
    payload: UpdateNurtureSequencePayload,
) => {
    const { id, name, active } = payload;

    if (!id) throw new Error("sequence id is required");

    return dbClient.nurtureSequence.update({
        where: { id },
        data: {
            ...(name !== undefined && { name }),
            ...(active !== undefined && { active }),
        },
    });
};

// ------------------------------
// Delete sequence (steps cascade delete per schema)
// ------------------------------
export const deleteNurtureSequenceService = async (id: string) => {
    if (!id) throw new Error("sequence id is required");

    return dbClient.nurtureSequence.delete({
        where: { id },
    });
};

// ------------------------------
// Add a single step to an existing sequence
// ------------------------------
interface AddNurtureStepPayload {
    sequenceId: string;
    channel: "sms" | "email" | "wa";
    wait: number;
    unit: "days" | "hours";
    message: string;
    badge?: string;
}

export const addNurtureStepService = async (payload: AddNurtureStepPayload) => {
    const { sequenceId, channel, wait, unit, message, badge } = payload;

    if (!sequenceId || !channel || !message) {
        throw new Error("sequenceId, channel and message are required");
    }

    // the new step goes at the end, so find the current highest order
    const lastStep = await dbClient.nurtureStep.findFirst({
        where: { sequenceId },
        orderBy: { order: "desc" },
    });

    const nextOrder = lastStep ? lastStep.order + 1 : 0;

    return dbClient.nurtureStep.create({
        data: {
            sequenceId,
            channel,
            wait,
            unit,
            message,
            badge,
            order: nextOrder,
        },
    });
};

// ------------------------------
// Update a step
// ------------------------------
interface UpdateNurtureStepPayload {
    id: string;
    channel?: "sms" | "email" | "wa";
    wait?: number;
    unit?: "days" | "hours";
    message?: string;
    badge?: string;
}

export const updateNurtureStepService = async (
    payload: UpdateNurtureStepPayload,
) => {
    const { id, ...rest } = payload;

    if (!id) throw new Error("step id is required");

    return dbClient.nurtureStep.update({
        where: { id },
        data: rest,
    });
};

// ------------------------------
// Delete a step
// ------------------------------
export const deleteNurtureStepService = async (id: string) => {
    if (!id) throw new Error("step id is required");

    return dbClient.nurtureStep.delete({
        where: { id },
    });
};