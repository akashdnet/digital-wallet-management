import { Schema, model } from "mongoose";
import { TTransaction, TTransactionStatus, TTransactionType } from "./transaction.interface";

const transactionSchema = new Schema<TTransaction>(
  {
    type: {
      type: String,
      enum: [ "send-money", "top-up", "cash-in", "cash-out"] as TTransactionType[],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    senderId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    receiverId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    mobileNumber: {
      type: Number,
    },
    agentId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    fee: {
      percentage: {
        type: Number,
      },
      charge: {
        type: Number,
      },
      fee: {
        type: Number,
      },
    },
    status: {
      type: String,
      enum: ["completed", "failed"] as TTransactionStatus[],
      default: "completed",
    },
  },
  {
    timestamps: true,
  }
);

export const Transaction = model<TTransaction>("Transaction", transactionSchema);
