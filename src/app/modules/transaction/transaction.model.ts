import { Schema, Types, model } from "mongoose";
import { TMethod, TTransaction } from "./transaction.interface";

const transactionSchema = new Schema<TTransaction>(
  {
    id: {
      type: String,
      require: true
    },
    method: {
      type: String,
      enum: ["top-up", "add-money", "send-money", "cash-in", "cash-out"],
      required: true,
    },
    from: {
      type: String,
      required: true,
    },
    fromUserID: { type: Types.ObjectId, ref: "User" },
    to: {
      type: String,
      required: true,
    },
    toUserID: { type: Types.ObjectId, ref: "User" },

    amount: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["completed", "failed"]
    },
  },
  {
    timestamps: true,
  }
);

export const Transaction = model<TTransaction>("Transaction", transactionSchema);
