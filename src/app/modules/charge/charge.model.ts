import { Schema, model } from "mongoose";
import { TCharge } from "./charge.interface";

const chargeSchema = new Schema<TCharge>(
  {
    sendMoneyCost: {
      type: Number,
      required: true,
    },
    withdrawalFeePercentage: {
      type: Number,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Charge = model<TCharge>("Charge", chargeSchema);
