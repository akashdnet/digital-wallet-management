import mongoose from "mongoose";
import { Wallet } from "./wallet.model";
import AppError from "../../utils/AppError";
import statusCode from "../../utils/statusCodes";
import { Charge } from "../charge/charge.model";
import { Transaction } from "../transaction/transaction.model";
import { User } from "../user/user.model";
import { TUserRole } from "../user/user.interface";
import generateTransitionId from "../../utils/generateTransitionId";
import { TTransaction } from "../transaction/transaction.interface";








interface TransferPayload {
  token_user_info: any;
  to: string;
  amount: number;
}

export const sendMoney = async (payload: TransferPayload) => {

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { token_user_info, to, amount } = payload;
    const amt = Number(amount);

    
    const fromUser = await User.findById(token_user_info._id).session(session);
    if (!fromUser || !fromUser.wallet) {
      throw new AppError(statusCode.NOT_FOUND, "Sender not found");
    }

    
    const toUser = await User.findOne({
      $or: [{ email: to }, { phone: to }],
    }).session(session);
    if (!toUser || !toUser.wallet) {
      throw new AppError(statusCode.NOT_FOUND, "Receiver not found");
    }

    
    const fromWallet = await Wallet.findById(fromUser.wallet).session(session);
    const toWallet = await Wallet.findById(toUser.wallet).session(session);

    if (!fromWallet || !toWallet) {
      throw new AppError(statusCode.NOT_FOUND, "Wallet not found");
    }

    
    if (fromWallet.status !== "active") {
      throw new AppError( statusCode.BAD_REQUEST, "Your Wallet must be active to send money." );
    }

    if (toWallet.status !== "active") {
      throw new AppError( statusCode.BAD_REQUEST, "Receiver wallet must be active to receive money." );
    }

    if (toUser.role !== "user") {
      throw new AppError(statusCode.BAD_REQUEST, "Only user can receive money. Not agent.");
    }

    if (fromWallet.balance < amt) {
      throw new AppError(statusCode.BAD_REQUEST, "Insufficient balance.");
    }


    fromWallet.balance -= amt;
    toWallet.balance += amt;

    await fromWallet.save({ session });
    await toWallet.save({ session });

    
    const transactionPayload: TTransaction = {
      date: new Date(),
      id: generateTransitionId(),
      method: "send-money",
      from: fromUser.phone!,
      fromUserID: fromUser._id, 
      to,
      toUserID: toUser._id,
      status: "completed",
      amount: amt,
    };

    await Transaction.create([transactionPayload], { session }); 

    await session.commitTransaction();
    session.endSession();

    return { success: true, message: "Money sent successfully" };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};


















export const cashOut = async (payload: TransferPayload) => {

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { token_user_info, to, amount } = payload;
    const amt = Number(amount);

    
    const fromUser = await User.findById(token_user_info._id).session(session);
    if (!fromUser || !fromUser.wallet) {
      throw new AppError(statusCode.NOT_FOUND, "Sender account not found.");
    }

    
    const toUser = await User.findOne({
      $or: [{ email: to }, { phone: to }],
    }).session(session);
    if (!toUser || !toUser.wallet) {
      throw new AppError(statusCode.NOT_FOUND, "Agent account not found.");
    }

    
    const fromWallet = await Wallet.findById(fromUser.wallet).session(session);
    const toWallet = await Wallet.findById(toUser.wallet).session(session);

    if (!fromWallet || !toWallet) {
      throw new AppError(statusCode.NOT_FOUND, "Wallet not found");
    }

    
    if (fromWallet.status !== "active") {
      throw new AppError( statusCode.BAD_REQUEST, "Your Wallet must be active to send money." );
    }

    if (toWallet.status !== "active") {
      throw new AppError( statusCode.BAD_REQUEST, "Receiver wallet must be active to receive money." );
    }

    if (toUser.role !== "agent") {
      throw new AppError(statusCode.BAD_REQUEST, "Cash out money can send only to agents.");
    }

    if (fromWallet.balance < amt) {
      throw new AppError(statusCode.BAD_REQUEST, "Insufficient balance.");
    }


    fromWallet.balance -= amt;
    toWallet.balance += amt;

    await fromWallet.save({ session });
    await toWallet.save({ session });

    
    const transactionPayload: TTransaction = {
      date: new Date(),
      id: generateTransitionId(),
      method: "cash-out",
      from: fromUser.phone!,
      fromUserID: fromUser._id, 
      to,
      toUserID: toUser._id,
      status: "completed",
      amount: amt,
    };

    await Transaction.create([transactionPayload], { session }); 

    await session.commitTransaction();
    session.endSession();

    return { success: true, message: "Successfully cash out done." };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};




export const cashIn = async (payload: TransferPayload) => {

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { token_user_info, to, amount } = payload;
    const amt = Number(amount);

    
    const fromUser = await User.findById(token_user_info._id).session(session);
    if (!fromUser || !fromUser.wallet) {
      throw new AppError(statusCode.NOT_FOUND, "Sender account not found.");
    }

    
    const toUser = await User.findOne({
      $or: [{ email: to }, { phone: to }],
    }).session(session);
    if (!toUser || !toUser.wallet) {
      throw new AppError(statusCode.NOT_FOUND, "User account not found.");
    }

    
    const fromWallet = await Wallet.findById(fromUser.wallet).session(session);
    const toWallet = await Wallet.findById(toUser.wallet).session(session);

    if (!fromWallet || !toWallet) {
      throw new AppError(statusCode.NOT_FOUND, "Wallet not found");
    }

    
    if (fromWallet.status !== "active") {
      throw new AppError( statusCode.BAD_REQUEST, "Your Wallet must be active to send money." );
    }

    if (toWallet.status !== "active") {
      throw new AppError( statusCode.BAD_REQUEST, "Receiver wallet must be active to receive money." );
    }

    if (toUser.role !== "user") {
      throw new AppError(statusCode.BAD_REQUEST, "Cash in money can transfer only to user account.");
    }

    if (fromWallet.balance < amt) {
      throw new AppError(statusCode.BAD_REQUEST, "Insufficient balance.");
    }


    fromWallet.balance -= amt;
    toWallet.balance += amt;

    await fromWallet.save({ session });
    await toWallet.save({ session });

    
    const transactionPayload: TTransaction = {
      date: new Date(),
      id: generateTransitionId(),
      method: "cash-in",
      from: fromUser.phone!,
      fromUserID: fromUser._id, 
      to,
      toUserID: toUser._id,
      status: "completed",
      amount: amt,
    };

    await Transaction.create([transactionPayload], { session }); 

    await session.commitTransaction();
    session.endSession();

    return { success: true, message: "Successfully cash in done." };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};








export const topUp = async (payload: TransferPayload) => {

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { token_user_info, to, amount } = payload;
    const amt = Number(amount);

    
    const fromUser = await User.findById(token_user_info._id).session(session);
    if (!fromUser || !fromUser.wallet) {
      throw new AppError(statusCode.NOT_FOUND, "Sender account not found.");
    }

    
    const toUser = await User.findOne({
      $or: [{ email: to }, { phone: to }],
    }).session(session);
    if (!toUser || !toUser.wallet) {
      throw new AppError(statusCode.NOT_FOUND, "User account not found.");
    }

    
    const fromWallet = await Wallet.findById(fromUser.wallet).session(session);
    const toWallet = await Wallet.findById(toUser.wallet).session(session);

    if (!fromWallet || !toWallet) {
      throw new AppError(statusCode.NOT_FOUND, "Wallet not found");
    }

    
    if (fromWallet.status !== "active") {
      throw new AppError( statusCode.BAD_REQUEST, "Your Wallet must be active to send money." );
    }

    if (toWallet.status !== "active") {
      throw new AppError( statusCode.BAD_REQUEST, "Receiver wallet must be active to receive money." );
    }

    // if (toUser.role !== "user") {
    //   throw new AppError(statusCode.BAD_REQUEST, "Cash in money can transfer only to user account.");
    // }

    if (fromWallet.balance < amt) {
      throw new AppError(statusCode.BAD_REQUEST, "Insufficient balance.");
    }


    fromWallet.balance -= amt;
    // toWallet.balance += amt;

    await fromWallet.save({ session });
    // await toWallet.save({ session });

    
    const transactionPayload: TTransaction = {
      date: new Date(),
      id: generateTransitionId(),
      method: "cash-in",
      from: fromUser.phone!,
      fromUserID: fromUser._id, 
      to,
      toUserID: toUser._id,
      status: "completed",
      amount: amt,
    };

    await Transaction.create([transactionPayload], { session }); 

    await session.commitTransaction();
    session.endSession();

    return { success: true, message: "Successfully top up done." };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};























const WalletServices = {

  sendMoney,
  topUp,
  cashIn,
  cashOut,
};

export default WalletServices;
