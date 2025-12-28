import { Schema, model } from "mongoose";
import { TContactUs } from "./contactus.interface";

const contactUsSchema = new Schema<TContactUs>(
    {
        fullName: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        message: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

export const ContactUs = model<TContactUs>("ContactUs", contactUsSchema);
