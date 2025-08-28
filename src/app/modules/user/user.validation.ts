import { z } from "zod";
import { TUser, TUserRole } from "./user.interface";

const createUserValidationSchema = z.object({
  name: z.string("Name is required"),
  email: z.email("Invalid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .max(20, "Password cannot be more than 20 characters long")
    .optional(),
});



const updateUserValidationSchema =  z.object({
    // profile_image: z.string().optional(),
    name: z.string("Name is required").optional(),
    email: z
      .string("Email is required")
      .email("Invalid email address")
      .optional(),
    role: z
      .array(z.enum(Object.values(TUserRole) as [string, ...string[]]))
      .optional(),
    wallet: z.string().optional(), // Assuming wallet is an ObjectId string
    agentStatus: z
      .enum(["idk", "approved", "suspended"])
      .optional(),
  })



export const UserValidation = {
  createUserValidationSchema,
  updateUserValidationSchema,
};
