import e from "express";
import AppError from "../../utils/AppError";
import statusCode from "../../utils/statusCodes";
import { TTransaction } from "./transaction.interface";
import { Transaction } from "./transaction.model";




const create = async (payload:TTransaction) => {
    

    const transaction = await Transaction.create(payload);
    
    if (!transaction) {
        throw new AppError(statusCode.BAD_REQUEST, "Failed to create transaction history");
    }
    
    return transaction;

 
}



const fetchAllTransactions = async () => {

    const transactions = await Transaction.find().populate("senderId", "name email").populate("receiverId", "name email");
    if (!transactions || transactions.length === 0) {
        throw new AppError(statusCode.NOT_FOUND, "No transactions found");
    }

    return transactions;
}





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
    getUserTransaction,
}

