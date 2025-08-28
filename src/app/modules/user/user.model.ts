import { Schema, model } from "mongoose";
import { TUser, TUserRole } from "./user.interface";

const userSchema = new Schema<TUser>(
  {
    avatar:{
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: Number,
      required: true,
      unique: true,
    },
    password: {
      type: String,
    },
    authProviders: [
      {
        provider: {
          type: String,
          enum: ["credential", "google"],
          required: true,
        },
        providerId: {
          type: String,
          required: true,
        },
      },
    ],
    role: {
      type: [String],
      enum: Object.values(TUserRole),
      default: [TUserRole.USER],
    },
    wallet: {
      type: Schema.Types.ObjectId,
      ref: "Wallet",
      unique: true,
    },
    agentStatus: {
      type: String,
      enum: ["idk", "approved", "suspended"],
      default: "idk",
    },
  },
  {
    timestamps: true,
  }
);

export const User = model<TUser>("User", userSchema);
