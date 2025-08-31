import { z } from "zod";

export const updateUserProfile = z.object({
  id: z.string(),
  name: z.string().min(3).max(50),
  email: z.email(),
  phone: z.string().regex(/^01[3-9]\d{8}$/, "Invalid Bangladeshi phone number"),
  role: z.enum(["user", "agent", "admin"]),
  agentStatus: z.enum(["idk", "approved", "suspended"]).optional(),
  walletBalance: z.number().min(0).optional(),
  walletStatus: z.enum(["pending", "active", "blocked"]),
});

export type UpdateUserProfileType = z.infer<typeof updateUserProfile>;

export const adminValidationSchema = {
  updateUserProfile,
};
