import { Schema, model } from "mongoose";
import { TTransaction, TTransactionStatus, TTransactionType } from "./transaction.interface";

const transactionSchema = new Schema<TTransaction>(
  {
    transactionId: {
      type : String,
      require: true
    },
    type: {
      type: String,
      enum: [ "send-money", "top-up", "cash-in", "cash-out"] as TTransactionType[],
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
    sentBy: {
      type: String,   //email or phone number
    },
    agentId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    charge: {
      currentBalance: {
        type: Number,
      },
      requestedSendingAmount: {
        type: Number ,
      },
      serviceChargeForSendMoneySet: {
        type: String || undefined, // how much admin set
      },
      serviceChargeForCashOutPercentageSet: {
        type: Number || undefined, // how much admin set
      },
      serviceChargeForCashOutPercentage: {
        type: Number, // how much the net charge 
      },
      amountWithCharge: {
        type: Number, // how much should reduce after adding charge fee
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
