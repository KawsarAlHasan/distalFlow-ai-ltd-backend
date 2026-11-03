import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import {
  createNewAdmin,
  getAllAdmin,
  updateAdmin,
  deleteAdmin,
  adminStatusChange,
} from "./admin.controller";
import {
  createAdminZodSchema,
  updateAdminStatusZodSchema,
  updateAdminZodSchema,
} from "./admin.validation";
const router = express.Router();

router.post("/create", validateRequest(createAdminZodSchema), createNewAdmin);
router.get("/", getAllAdmin);
router.patch("/update", validateRequest(updateAdminZodSchema), updateAdmin);

router.patch(
  "/update-status",
  validateRequest(updateAdminStatusZodSchema),
  adminStatusChange,
);
router.delete("/:id", deleteAdmin);

export const AdminRoutes = router;
