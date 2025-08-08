import { ObjectId } from "mongoose";

export type TTransactionType = "top-up" | "add-money" | "send-money" | "cash-in" | "cash-out";

export type TTransactionStatus = "completed" | "failed";

export interface TTransactionFee {
    percentage: number;
    charge: number;
    fee: number; 
}

export interface TTransaction {
    type: TTransactionType;
    amount: number;
    senderId?: ObjectId;
    receiverId?: ObjectId;
    agentId?: ObjectId;
    fee?: TTransactionFee;
    status?: TTransactionStatus;
    mobileNumber?: number;
}
