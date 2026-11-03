import { StatusCodes } from "http-status-codes";
import ApiError from "../../../errors/ApiError";
import { dbClient } from "../../../lib/prisma";

// ------------------------------
// Template steps (rich default sequence)
// ------------------------------
const TREATMENT_TEMPLATE_STEPS = [
  {
    channel: "sms" as const,
    wait: 0,
    unit: "days" as const,
    message:
      "Hi {name}, thanks for your enquiry with Bright Smile. We'll call you shortly — or reply here with any questions.",
    badge: null,
    order: 0,
  },
  {
    channel: "email" as const,
    wait: 1,
    unit: "days" as const,
    message: '"What to expect" — patient stories + finance options.',
    badge: null,
    order: 1,
  },
  {
    channel: "wa" as const,
    wait: 2,
    unit: "days" as const,
    message: "Pre-approved template: gentle nudge with one-click booking link.",
    badge: "Growth+",
    order: 2,
  },
  {
    channel: "sms" as const,
    wait: 4,
    unit: "days" as const,
    message: "Still thinking it over, {name}? Here's that booking link once more.",
    badge: null,
    order: 3,
  },
];

// ------------------------------
// Types
// ------------------------------
interface CreateNurtureSequencePayload {
  name: string;
  campaignId?: string | null;
  clinicId: string;
  template?: "treatment" | "blank";
}

interface UpdateNurtureSequencePayload {
  name?: string;
  active?: boolean;
  campaignId?: string | null;
}

interface AddNurtureStepPayload {
  sequenceId: string;
  channel: "sms" | "email" | "wa";
  wait: number;
  unit: "days" | "hours";
  message: string;
  badge?: string | null;
  order?: number;
}

interface UpdateNurtureStepPayload {
  channel?: "sms" | "email" | "wa";
  wait?: number;
  unit?: "days" | "hours";
  message?: string;
  badge?: string | null;
  order?: number;
}

// ------------------------------
// Create Nurture Sequence
// ------------------------------
export const createNurtureSequenceService = async (
  payload: CreateNurtureSequencePayload,
) => {
  const { name, campaignId, clinicId, template = "treatment" } = payload;

  if (!name || !clinicId) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "name and clinicId are required");
  }

  // Validate campaignId if provided
  let validCampaignId: string | undefined = undefined;
  if (campaignId) {
    const campaign = await dbClient.campaign.findFirst({
      where: { id: campaignId, clinicId },
    });
    if (campaign) {
      validCampaignId = campaign.id;
    }
  }

  const result = await dbClient.$transaction(async (tx) => {
    const nurtureSequence = await tx.nurtureSequence.create({
      data: {
        name,
        clinicId,
        campaignId: validCampaignId,
        active: true,
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
          badge: step.badge,
          order: step.order,
        })),
      });
    }

    const sequenceWithSteps = await tx.nurtureSequence.findUnique({
      where: { id: nurtureSequence.id },
      include: {
        steps: {
          orderBy: { order: "asc" },
        },
        campaign: {
          select: { id: true, name: true },
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
  let sequences = await dbClient.nurtureSequence.findMany({
    where: { clinicId },
    include: {
      steps: {
        orderBy: { order: "asc" },
      },
      campaign: {
        select: { id: true, name: true },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  // If clinic has no sequences yet, seed default "Implants — default" sequence
  if (sequences.length === 0) {
    await createNurtureSequenceService({
      name: "Implants — default",
      clinicId,
      template: "treatment",
    });

    sequences = await dbClient.nurtureSequence.findMany({
      where: { clinicId },
      include: {
        steps: {
          orderBy: { order: "asc" },
        },
        campaign: {
          select: { id: true, name: true },
        },
      },
      orderBy: { createdAt: "asc" },
    });
  }

  return sequences;
};

// ------------------------------
// Get single sequence by ID
// ------------------------------
export const getNurtureSequenceByIdService = async (
  id: string,
  clinicId: string,
) => {
  const sequence = await dbClient.nurtureSequence.findFirst({
    where: { id, clinicId },
    include: {
      steps: {
        orderBy: { order: "asc" },
      },
      campaign: {
        select: { id: true, name: true },
      },
    },
  });

  if (!sequence) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Nurture sequence not found");
  }

  return sequence;
};

// ------------------------------
// Update sequence (name / active / campaignId)
// ------------------------------
export const updateNurtureSequenceService = async (
  id: string,
  clinicId: string,
  payload: UpdateNurtureSequencePayload,
) => {
  const existing = await dbClient.nurtureSequence.findFirst({
    where: { id, clinicId },
  });

  if (!existing) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Nurture sequence not found");
  }

  let campaignData: string | null | undefined = undefined;
  if (payload.campaignId !== undefined) {
    if (!payload.campaignId) {
      campaignData = null;
    } else {
      const campaign = await dbClient.campaign.findFirst({
        where: { id: payload.campaignId, clinicId },
      });
      if (campaign) {
        campaignData = campaign.id;
      } else {
        campaignData = null;
      }
    }
  }

  return dbClient.nurtureSequence.update({
    where: { id },
    data: {
      ...(payload.name !== undefined && { name: payload.name }),
      ...(payload.active !== undefined && { active: payload.active }),
      ...(campaignData !== undefined && { campaignId: campaignData }),
    },
    include: {
      steps: {
        orderBy: { order: "asc" },
      },
      campaign: {
        select: { id: true, name: true },
      },
    },
  });
};

// ------------------------------
// Delete sequence (steps cascade delete per schema)
// ------------------------------
export const deleteNurtureSequenceService = async (
  id: string,
  clinicId: string,
) => {
  const existing = await dbClient.nurtureSequence.findFirst({
    where: { id, clinicId },
  });

  if (!existing) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Nurture sequence not found");
  }

  return dbClient.nurtureSequence.delete({
    where: { id },
  });
};

// ------------------------------
// Add a single step to an existing sequence
// ------------------------------
export const addNurtureStepService = async (
  clinicId: string,
  payload: AddNurtureStepPayload,
) => {
  const { sequenceId, channel, wait, unit, message, badge, order } = payload;

  if (!sequenceId || !channel || !message) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      "sequenceId, channel and message are required",
    );
  }

  const sequence = await dbClient.nurtureSequence.findFirst({
    where: { id: sequenceId, clinicId },
  });

  if (!sequence) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Nurture sequence not found");
  }

  let stepOrder = order;
  if (stepOrder === undefined) {
    const lastStep = await dbClient.nurtureStep.findFirst({
      where: { sequenceId },
      orderBy: { order: "desc" },
    });
    stepOrder = lastStep ? lastStep.order + 1 : 0;
  }

  return dbClient.nurtureStep.create({
    data: {
      sequenceId,
      channel,
      wait,
      unit,
      message,
      badge: badge ?? (channel === "wa" ? "Growth+" : null),
      order: stepOrder,
    },
  });
};

// ------------------------------
// Update a step
// ------------------------------
export const updateNurtureStepService = async (
  id: string,
  clinicId: string,
  payload: UpdateNurtureStepPayload,
) => {
  const step = await dbClient.nurtureStep.findUnique({
    where: { id },
    include: { sequence: true },
  });

  if (!step || step.sequence.clinicId !== clinicId) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Nurture step not found");
  }

  return dbClient.nurtureStep.update({
    where: { id },
    data: {
      ...(payload.channel !== undefined && { channel: payload.channel }),
      ...(payload.wait !== undefined && { wait: payload.wait }),
      ...(payload.unit !== undefined && { unit: payload.unit }),
      ...(payload.message !== undefined && { message: payload.message }),
      ...(payload.badge !== undefined && { badge: payload.badge }),
      ...(payload.order !== undefined && { order: payload.order }),
    },
  });
};

// ------------------------------
// Delete a step
// ------------------------------
export const deleteNurtureStepService = async (
  id: string,
  clinicId: string,
) => {
  const step = await dbClient.nurtureStep.findUnique({
    where: { id },
    include: { sequence: true },
  });

  if (!step || step.sequence.clinicId !== clinicId) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Nurture step not found");
  }

  await dbClient.nurtureStep.delete({
    where: { id },
  });

  // Re-normalize order of remaining steps in the sequence
  const remainingSteps = await dbClient.nurtureStep.findMany({
    where: { sequenceId: step.sequenceId },
    orderBy: { order: "asc" },
  });

  for (let i = 0; i < remainingSteps.length; i++) {
    if (remainingSteps[i].order !== i) {
      await dbClient.nurtureStep.update({
        where: { id: remainingSteps[i].id },
        data: { order: i },
      });
    }
  }

  return { id, sequenceId: step.sequenceId };
};
