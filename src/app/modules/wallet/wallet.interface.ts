import { ObjectId } from "mongoose";

export type TWalletStatus = "pending" | "active" | "blocked";

export interface TWallet {
    user: ObjectId;
    balance: number;
    status: TWalletStatus;
}
