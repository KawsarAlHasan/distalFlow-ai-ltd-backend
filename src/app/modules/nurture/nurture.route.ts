import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { adminAuth, clinicAdminAuth, userAuth } from "../../middlewares/auth";
import fileUploadHandler from "../../middlewares/fileUploadHandler";
import { createNurtureSequence } from "./nurture.controller";

const router = express.Router();

router.post("/create", clinicAdminAuth(), createNurtureSequence);

// router.patch(
//   "/update-status",
//   adminAuth(),
//   validateRequest(updateUserStatusZodSchema),
//   userStatusChange,
// );
// router.put(
//   "/update-profile",
//   userAuth(),
//   validateRequest(updateOwnUserDataZodSchema),
//   updateUserOwnData,
// );

// router.put(
//   "/update-profile-image",
//   userAuth(),
//   fileUploadHandler(),
//   updateUserImage,
// );

// router.delete("/:id", adminAuth(), deleteUser);

export const NurtureRoutes = router;
