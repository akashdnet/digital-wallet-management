import { z } from "zod";
import { TUser, TUserRole } from "./user.interface";

const createUserValidationSchema = z.object({
  name: z.string("Name is required"),
  email: z.email("Invalid email address"),
  phone: z.string("Invalid phone number").regex(/^01[3-9]\d{8}$/, {
      message: "Invalid Bangladeshi phone number",
    }),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .max(20, "Password cannot be more than 20 characters long")
    .optional(),
  role: z.enum([TUserRole.USER, TUserRole.AGENT,], {
      error: "Role must be either 'user' or 'agent'.",
    }),

});



const updateUserValidationSchema =  z.object({
    name: z.string("Name is required").optional(),
    email: z.email("Invalid email address")
      .optional(),
    wallet: z.string().optional(), // Assuming wallet is an ObjectId string
    agentStatus: z
      .enum(["idk", "approved", "suspended"])
      .optional(),
  })

const updateMyProfileValidationSchema =  z.object({
    name: z.string("Name is required").optional(),
    email: z.email("Invalid email address").optional(),
    phone: z.string("Invalid phone number").regex(/^01[3-9]\d{8}$/, {
      message: "Invalid Bangladeshi phone number",
    }),
  })



export const UserValidation = {
  createUserValidationSchema,
  updateUserValidationSchema,
  updateMyProfileValidationSchema,
};
