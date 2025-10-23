import { Types } from "mongoose";
import { TUser } from "../user/user.interface";

export type TMethod = "top-up" | "add-money" | "send-money" | "cash-in" | "cash-out";

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
    date: Date;
    id: string;
    method: TMethod;
    from: string;
    formUserID: Types.ObjectId | TUser; 
    to: string;
    toUserID: Types.ObjectId | TUser;
    status: TTransactionStatus;
    amount: number;

}


