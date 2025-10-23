import { Schema, model } from "mongoose";
import { TUser, TUserRole } from "./user.interface";
import bcrypt from "bcrypt";
import { envList } from "../../config/envList";


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
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: (value: string) => {
          const phoneRegex = /^01[0-9]{9}$/;
          return phoneRegex.test(value);
        },
        message: "Invalid Bangladeshi phone number",
      }
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
      type: String,
      enum: Object.values(["user", "agent", "admin"]),
      default: "user",
    },
    wallet: {
      type: Schema.Types.ObjectId,
      ref: "Wallet",
      unique: true,
    },
   
  },
  {
    timestamps: true,
  }
);





userSchema.pre("save", async function (next) {
  if (this.isModified("password") && this.password) {
    const saltRounds = envList.BCRYPT_SALT_ROUND;
    this.password = await bcrypt.hash(this.password, saltRounds);
  }
  next();
});






export const User = model<TUser>("User", userSchema);
