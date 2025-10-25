import { z } from "zod";
import {  TUserRole } from "./user.interface";

const create = z.object({
  name: z.string().min(3).max(50, "Name must be at most 50 characters long"),
  email: z.email("Invalid email address"),
  phone: z.string().regex( /^01[0-9]{9}$/ , {
    message: "Invalid BD phone number",
  }),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(20, "Password cannot be more than 20 characters long")
    .optional(),
  role: z.enum([TUserRole.USER, TUserRole.AGENT,], {
      error: "Role must be either 'user' or 'agent'.",
    }),

});





const update =  z.object({
    id: z.string("Id is required"),
    name: z.string("Name is required"),
    email: z.email("Invalid email address"),
    phone: z.string("Invalid phone number").regex(/^01[3-9]\d{8}$/, {
      message: "Invalid Bangladeshi phone number",
    }),
  })




  const changePassword = z.object({
    id: z.string("Id is required"),
    oldPassword: z.string().min(8, "Old password is required"),
    newPassword: z.string().min(8, "New password must be at least 8 characters"),
    confirm_new_password: z.string().min(8, "Confirm password is required"),
  })
  .refine((data) => data.newPassword === data.confirm_new_password, {
    message: "Passwords do not match",
    path: ["confirm_new_password"], 
  })




export const UserValidation = {
  create,
  update,
  changePassword,
};
