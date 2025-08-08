import { Schema, model } from "mongoose";
import { TWallet } from "./wallet.interface";

const walletSchema = new Schema<TWallet>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    balance: {
      type: Number,
      default: 50,
    },
    status: {
      type: String,
      enum: ["pending", "active", "blocked"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

export const Wallet = model<TWallet>("Wallet", walletSchema);
