import { z } from "zod";

export const updateUserProfile = z.object({
  
  name: z.string().min(3).max(50, "Name must be at most 50 characters long"),
  email: z.email({ message: "Invalid email address" }),
  phone: z.string().regex(/^01[3-9]\d{8}$/, "Invalid Bangladeshi phone number"),
  password: z.string().optional(),

});

export type UpdateUserProfileType = z.infer<typeof updateUserProfile>;

export const adminValidationSchema = {
  updateUserProfile,
};
