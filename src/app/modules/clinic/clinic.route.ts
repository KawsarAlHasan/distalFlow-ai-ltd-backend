import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { createNewClinic } from "./clinic.controller";

const router = express.Router();

router.post("/create", createNewClinic);
// router.get("/", getAllAdmin);
// router.patch("/update", validateRequest(updateAdminZodSchema), updateAdmin);

// router.patch(
//   "/update-status",
//   validateRequest(updateAdminStatusZodSchema),
//   adminStatusChange,
// );
// router.delete("/:id", deleteAdmin);

export const ClinicRoutes = router;
