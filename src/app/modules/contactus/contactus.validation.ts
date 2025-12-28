import { z } from "zod";

const create = z.object({
    fullName: z.string().min(1, "Full name is required"),
    email: z.string().email("Invalid email address"),
    message: z.string().min(1, "Message is required"),
});

export const ContactUsValidation = {
    create,
};
