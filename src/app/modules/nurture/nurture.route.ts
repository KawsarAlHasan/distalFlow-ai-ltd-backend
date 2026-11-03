import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { clinicAdminAuth } from "../../middlewares/auth";
import {
  createNurtureSequence,
  getAllNurtureSequences,
  getNurtureSequenceById,
  updateNurtureSequence,
  deleteNurtureSequence,
  addNurtureStep,
  updateNurtureStep,
  deleteNurtureStep,
} from "./nurture.controller";
import {
  createNurtureSequenceZod,
  updateNurtureSequenceZod,
  createNurtureStepZod,
  updateNurtureStepZod,
} from "./nurture.validation";

const router = express.Router();

// Sequences
router.get("/all", clinicAdminAuth(), getAllNurtureSequences);

router.post(
  "/create",
  clinicAdminAuth(),
  validateRequest(createNurtureSequenceZod),
  createNurtureSequence,
);

// Steps (Must be placed before parameterized /:id route)
router.post(
  "/step",
  clinicAdminAuth(),
  validateRequest(createNurtureStepZod),
  addNurtureStep,
);

router.patch(
  "/step/:id",
  clinicAdminAuth(),
  validateRequest(updateNurtureStepZod),
  updateNurtureStep,
);

router.delete("/step/:id", clinicAdminAuth(), deleteNurtureStep);

// Sequence by ID
router.get("/:id", clinicAdminAuth(), getNurtureSequenceById);

router.patch(
  "/:id",
  clinicAdminAuth(),
  validateRequest(updateNurtureSequenceZod),
  updateNurtureSequence,
);

router.delete("/:id", clinicAdminAuth(), deleteNurtureSequence);

export const NurtureRoutes = router;
