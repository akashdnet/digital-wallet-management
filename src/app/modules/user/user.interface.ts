import { ObjectId } from "mongoose";

export enum TUserRole {
    USER = "user",
    AGENT = "agent",
    ADMIN = "admin",
}

export type TAgentStatus = "idk" | "approved" | "suspended";

export interface TAuthProvider {
    provider: "credential" | "google",
    providerId: string
}


export interface TUser {
    _id?: ObjectId,
    profile_image?:string;
    name:string;
    email:string;
    password?:string;
    authProviders?: TAuthProvider[]
    role?: TUserRole[];
    wallet?: ObjectId,
    agentStatus?: TAgentStatus;
}
