import { z } from "zod";

export const createAdminZodSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Invalid email address"),
    password: z
      .string()
      .min(1, "Password is required")
      .min(6, "Password must be at least 6 characters"),
    phone: z.string().optional(),
    roleName: z.enum(["Super Admin", "Success", "Support"], {
      error: "Role must be either 'Super Admin' or 'Admin' or 'Support'",
    }),
  }),
});

export const updateAdminZodSchema = z.object({
  body: z.object({
    id: z.string().min(1, "Id is required"),
    name: z.string().optional(),
    phone: z.string().optional(),
    roleName: z
      .enum(["Super Admin", "Success", "Support"], {
        error: "Role must be either 'Super Admin' or 'Admin' or 'Support'",
      })
      .optional(),
  }),
});

export const updateAdminStatusZodSchema = z.object({
  body: z.object({
    id: z.string().min(1, "Id is required"),
    status: z.enum(["ACTIVE", "PENDING", "INACTIVE", "SUSPENDED", "DELETED"], {
      error:
        "Status must be one of ACTIVE, PENDING, INACTIVE, SUSPENDED, DELETED",
    }),
  }),
});
