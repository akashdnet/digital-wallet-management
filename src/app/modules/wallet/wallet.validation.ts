import { z } from "zod";


const sendMoney = z.object({
    amount: z.string().regex(/^\d+(\.\d{1,2})?$/, "Amount must be a valid positive number.")
        .refine((val) => parseFloat(val) > 0, {
          message: "Amount must be greater than 0",
        }),
    to: z.union([
        z.email("Invalid email address"),
        z.string().regex(/^01[3-9]\d{8}$/, "Invalid Bangladeshi phone number"),
    ])
  })



const cashOut = z.object({
    amount: z.string().regex(/^\d+(\.\d{1,2})?$/, "Amount must be a valid positive number.")
        .refine((val) => parseFloat(val) > 0, {
          message: "Amount must be greater than 0",
        }),
    to: z.string().regex(/^01[3-9]\d{8}$/, "Invalid Bangladeshi phone number"),
  })



const cashIn = z.object({
    amount: z.string().regex(/^\d+(\.\d{1,2})?$/, "Amount must be a valid positive number.")
        .refine((val) => parseFloat(val) > 0, {
          message: "Amount must be greater than 0",
        }),
    to: z.string().regex(/^01[3-9]\d{8}$/, "Invalid Bangladeshi phone number"),
  })


const topUp = z.object({
    amount: z.string().regex(/^\d+(\.\d{1,2})?$/, "Amount must be a valid positive number.")
        .refine((val) => parseFloat(val) > 0, {
          message: "Amount must be greater than 0",
        }),
    to: z.string().regex(/^01[3-9]\d{8}$/, "Invalid Bangladeshi phone number"),
  })




  export const WalletValidation = {
    sendMoney,
    cashOut,
    cashIn,
    topUp,
  
  };