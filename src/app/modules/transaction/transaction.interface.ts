import { ObjectId } from "mongoose";

export type TTransactionType = "top-up" | "add-money" | "send-money" | "cash-in" | "cash-out";

export type TTransactionStatus = "completed" | "failed";

export interface TTransactionFee {
    percentage: number;
    charge: number;
    fee: number; 
}





export interface TCharge {
      currentBalance: number;
      requestedSendingAmount: number;
      serviceChargeForSendMoneySet: number;
      serviceChargeForCashOutPercentageSet: string;
      serviceChargeForCashOutPercentage: number;
      amountWithCharge: number;
    

    }



export interface TTransaction {
    transactionId: string
    type: TTransactionType;
    senderId?: ObjectId;
    receiverId?: ObjectId;
    sentBy: string;
    agentId?: ObjectId;
    charge?: TCharge;
    status?: TTransactionStatus;
    mobileNumber?: number;
}
