import e, { Request } from "express";
import AppError from "../../utils/AppError";
import statusCode from "../../utils/statusCodes";
import { TTransaction } from "./transaction.interface";
import { Transaction } from "./transaction.model";
import { TUser } from "../user/user.interface";




const create = async (payload:TTransaction) => {
    

    const transaction = await Transaction.create(payload);
    
    if (!transaction) {
        throw new AppError(statusCode.BAD_REQUEST, "Failed to create transaction history");
    }
    
    return transaction;

 
}


const test = async (payload:any) => {
    

    const transaction = await Transaction.insertMany(payload);
    
    if (!transaction) {
        throw new AppError(statusCode.BAD_REQUEST, "Failed to create transaction history");
    }
    
    return transaction;

 
}



const fetchAllTransactions = async () => {
    const totalTransactions = await Transaction.countDocuments();
    

    const transactions = await Transaction.find().populate("senderId", "name email").populate("receiverId", "name email");
    if (!transactions || transactions.length === 0) {
        throw new AppError(statusCode.NOT_FOUND, "No transactions found");
    }

    return {transactions, totalTransactions};
}




// done
const fetchMyAllTransactions = async (req:Request) => {

  const queries = req.query

  const limit = Number(queries?.limit) || 10;
  const page = Number(queries?.page) || 1;
  const skip = (page - 1) * limit;
  const term = queries?.term || "";





  const filter: any = {
   $or: [
        { to: req.token_user_info?.phone }, 
        { from: req.token_user_info?.phone }, 
        { fromUserID: req.token_user_info?._id }, 
        {toUserID: req.token_user_info?._id },
      ]
  };

  if (term) {
    filter.$and = [
      {
        $or: [
          { invoice: { $regex: term, $options: "i" } },
          { method: { $regex: term, $options: "i" } },
          { to: { $regex: term, $options: "i" } },
          { from: { $regex: term, $options: "i" } },
        ],
      },
    ];
  }

  const totalTransactions = await Transaction.countDocuments(filter);

  const transactions = await Transaction.find(filter)
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(skip);

  return {
    transactions,
    meta: {
      totalTransactions,
      page,
      limit,
      totalPages: Math.ceil(totalTransactions / limit),
    },
  };
};







const getUserTransaction = async (id: string) => {
   // transaction by user id
    const transactions = await Transaction.find({ 
        $or: [
            { senderId: id }, 
            { receiverId: id }]
         }
        )
        .populate("senderId", "name email").populate("receiverId", "name email");


    return {
        transactions,
        totalTransactions: transactions.length
    };
};






export const TransactionServices = {
    create,
    fetchAllTransactions,
    fetchMyAllTransactions,
    getUserTransaction,
    test,
}

