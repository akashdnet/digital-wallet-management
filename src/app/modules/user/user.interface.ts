import { ObjectId } from "mongoose";

export enum TUserRole {
    USER = "user",
    AGENT = "agent",
    ADMIN = "admin",
}


export interface TAuthProvider {
    provider: "credential" | "google",
    providerId: string
}


export interface TUser {
    _id?: ObjectId,
    avatar?:string;
    name:string;
    email:string;
    phone?:string;
    password?:string;
    authProviders?: TAuthProvider[]
    role?: TUserRole;
    wallet?: ObjectId,
}
