import { ObjectId } from "mongoose";
import { Wallet } from "./wallet.model";
import AppError from "../../utils/AppError";
import statusCode from "../../utils/statusCodes";
import { TTransaction } from "../transaction/transaction.interface";
import { Charge } from "../charge/charge.model";
import { Transaction } from "../transaction/transaction.model";
import { User } from "../user/user.model";
import { TUserRole } from "../user/user.interface";
import { checkNumberOrEmail } from "../../utils/checkNumberOrEmail";
import generateTransitionId from "../../utils/generateTransitionId";

const createWallet = async (userId: ObjectId) => {
  const existingWallet = await Wallet.findOne({ user: userId });
  if (existingWallet) {
    throw new AppError(
      statusCode.BAD_REQUEST,
      "Wallet already exists for this user."
    );
  }

  const newWallet = await Wallet.create({ user: userId });

  return newWallet;
};

const getWalletByUserId = async (userId: string) => {
  const wallet = await Wallet.findOne({ user: userId });
  if (!wallet) {
    throw new AppError(statusCode.NOT_FOUND, "Wallet not found for this user.");
  }
  return wallet;
};

const walletStatus = async (payload: { id: string; status: string }) => {
  const { id, status } = payload;

  if (!id || !status) {
    throw new AppError(
      statusCode.BAD_REQUEST,
      "User ID and status are required."
    );
  }

  const allowedStatuses = ["pending", "active", "blocked"];
  if (!allowedStatuses.includes(status)) {
    throw new AppError(
      statusCode.BAD_REQUEST,
      `Invalid status: ${status}. Allowed statuses are ${allowedStatuses.join(
        ", "
      )}.`
    );
  }

  const wallet = await Wallet.findOneAndUpdate(
    { user: id },
    { status: status },
    { new: true }
  );

  if (!wallet) {
    throw new AppError(statusCode.NOT_FOUND, "Wallet not found for this user.");
  }

  return wallet;
};

const sendMoney = async (req: any) => {
  const payload: {amount: number, sendTo?: string } = req.body;
  // const senderId = req.token_user_info._id;

  if (payload.amount! < 1) {
    throw new AppError(
      statusCode.BAD_REQUEST,
      "Amount must be higher than zero."
    );
  }

  const isNumberOrEmail = checkNumberOrEmail(payload.sendTo!);
  if (isNumberOrEmail === "invalid") {
    throw new AppError(
      statusCode.BAD_REQUEST,
      "Invalid User Phone number or Email."
    );
  }

  let receiverAccountByEmail;
  let receiverAccountByPhoneNumber;
  if (isNumberOrEmail === "email") {
    receiverAccountByEmail = await User.findOne({ email: payload.sendTo });
    if (!receiverAccountByEmail) {
      throw new AppError(statusCode.NOT_FOUND, "Receiver Email not found.");
    }
  } else {
    receiverAccountByPhoneNumber = await User.findOne({
      phone: payload.sendTo,
    });
    if (!receiverAccountByPhoneNumber) {
      throw new AppError(
        statusCode.NOT_FOUND,
        "Receiver Phone number not found."
      );
    }
  }

  const receiveId =
    receiverAccountByEmail?._id || receiverAccountByPhoneNumber?._id;
  const senderId = req.decodedToken.userId;


  if (
    req.token_user_info?.phone === receiverAccountByPhoneNumber ||
    req.token_user_info?.email === receiverAccountByEmail
  ) {
    throw new AppError(
      statusCode.BAD_REQUEST,
      "Cannot send money to yourself."
    );
  }

  const session = await Wallet.startSession();
  session.startTransaction();
  try {
    const senderWallet = await Wallet.findOne({ user: senderId }).session(
      session
    );

    const senderWalletOldData = senderWallet
    if (!senderWallet) {
      throw new AppError(statusCode.NOT_FOUND, "Sender wallet not found.");
    }

    if (senderWallet.status !== "active") {
      throw new AppError(
        statusCode.BAD_REQUEST,
        "Only active wallets can send money."
      );
    }

    if (req.token_user_info?.role.includes("agent")) {
      throw new AppError(
        statusCode.BAD_REQUEST,
        "Agent can not send-money, only users are allowed to send money. But Agent can send cash-in"
      );
    }

    // calculate amount with charge
    const serviceCharge = await Charge.findOne({ slug: "service-charge" });
    if (!serviceCharge) {
      throw new AppError(statusCode.NOT_FOUND, "Service charge not found.");
    }

    const amountWithCharge = Number(payload.amount) + Number(serviceCharge.sendMoneyCost);
    if (amountWithCharge > senderWallet.balance) {
      throw new AppError(
        statusCode.BAD_REQUEST,
        "Insufficient balance after including transaction charge."
      );
    }

    let receiverWallet;
    if (receiverAccountByPhoneNumber) {
      receiverWallet = await Wallet.findOne({
        user: receiverAccountByPhoneNumber._id,
      }).session(session);
      if (!receiverWallet) {
        throw new AppError(statusCode.NOT_FOUND, "Receiver wallet not found.");
      }
    } else {
      receiverWallet = await Wallet.findOne({
        user: receiverAccountByEmail?._id,
      }).session(session);
      if (!receiverWallet) {
        throw new AppError(statusCode.NOT_FOUND, "Receiver wallet not found.");
      }
    }

    // const receiverWallet = await Wallet.findOne({ user: payload.receiverId }).session(session);
    // if (!receiverWallet) {
    //   throw new AppError(statusCode.NOT_FOUND, "Receiver wallet not found.");
    // }
    if (receiverWallet.status !== "active") {
      throw new AppError(
        statusCode.BAD_REQUEST,
        "Only active wallets can receive money."
      );
    }

    senderWallet.balance = Number(senderWallet.balance) - Number(amountWithCharge);
    await senderWallet.save({ session });

    receiverWallet.balance = Number(receiverWallet.balance) + Number(payload.amount!);
    await receiverWallet.save({ session });

    // create transaction
    const transaction = await Transaction.create(
      [
        {
          transactionId: generateTransitionId(),
          type: "send-money",
          senderId: senderId,
          receiverId: receiveId,
          sentBy: req.body.sendTo,
          charge: {
            currentBalance: senderWalletOldData?.balance,
            requestedSendingAmount:  req.body.amount,
            serviceChargeForSendMoneySet: `TK ${serviceCharge.sendMoneyCost}`,
            amountWithCharge: amountWithCharge ,
          },
          status: "completed",
        },
      ],
      { session }
    );

    if (!transaction.length) {
      throw new AppError(
        statusCode.BAD_REQUEST,
        "Failed to create transaction history"
      );
    }

    await session.commitTransaction();
    session.endSession();

    return { senderWallet, receiverWallet, transaction: transaction[0] };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const topUp = async (req: any) => {
  const payload: {amount: number, sendTo: string } = req.body;
  const senderId = req.token_user_info._id;

  if (payload?.amount < 10) {
    throw new AppError(
      statusCode.BAD_REQUEST,
      "TopUp Amount must be higher than 10."
    );
  }

  // if (senderId === payload.receiverId) {
  //   throw new AppError(statusCode.BAD_REQUEST, "Cannot send money to yourself.");
  // }



  // console.log(`mobile number         :${payload.sendTo}`)
  
  const phoneNumberValidation = /^(01[3-9]\d{8})$/.test(payload.sendTo);



  if ( !req.body.sendTo || !phoneNumberValidation) {
    throw new AppError(
      statusCode.BAD_REQUEST,
      "Invalid mobile number format. Please provide a valid BD mobile number."
    );
  }

  const session = await Wallet.startSession();
  session.startTransaction();
  try {
    const senderWallet = await Wallet.findOne({ user: senderId }).session(
      session
    );
    if (!senderWallet) {
      throw new AppError(statusCode.NOT_FOUND, "Sender wallet not found.");
    }

    if (senderWallet.status !== "active") {
      throw new AppError(
        statusCode.BAD_REQUEST,
        "Only active wallets can TopUp."
      );
    }

    if (req.body.amount > senderWallet.balance) {
      throw new AppError(
        statusCode.BAD_REQUEST,
        "Insufficient balance for TopUp."
      );
    }



    senderWallet.balance = Number(senderWallet.balance) - Number(req.body.amount);
    await senderWallet.save({ session });


    const transaction = await Transaction.create(
      [
        {
          transactionId: generateTransitionId(),
          type: "top-up",
          senderId: senderId,
          receiverId: null,
          sentBy: req.body.sendTo,
          charge: {
            currentBalance: Number(senderWallet.balance) + Number(req.body.amount),
            requestedSendingAmount:  req.body.amount,
            serviceChargeForSendMoneySet: `TK 0`,
            amountWithCharge: req.body.amount ,
          },
          status: "completed",
        },
      ],
      { session }
    );

    if (!transaction.length) {
      throw new AppError(
        statusCode.BAD_REQUEST,
        "Failed to create transaction history"
      );
    }

    await session.commitTransaction();
    session.endSession();

    return { senderWallet, transaction: transaction[0] };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const cashIn = async (req: any) => {
  const payload: {amount: number, sendTo: string } = req.body;

  if (payload.amount < 10) {
    throw new AppError(
      statusCode.BAD_REQUEST,
      "Amount must be higher than 10."
    );
  }

  const session = await Wallet.startSession();
  session.startTransaction();
  try {
    const senderWallet = await Wallet.findOne({
      user: req.token_user_info._id,
    }).session(session);
    if (!senderWallet) {
      throw new AppError(statusCode.NOT_FOUND, "Your Wallet not found.");
    }

    if (
      senderWallet.status !== "active" ||
      req.token_user_info.agentStatus !== "approved"
    ) {
      throw new AppError(
        statusCode.BAD_REQUEST,
        "Only Approved Agents with active wallets can cash-in to user wallets."
      );
    }

    // calculate amount with charge
    // const serviceCharge = await Charge.findOne({ slug: "service-charge" });
    // if (!serviceCharge) {
    //   throw new AppError(statusCode.NOT_FOUND, "Service charge not found.");
    // }

    // const amountWithCharge = payload.amount + serviceCharge.withdrawalFeePercentage * payload.amount / 100;
    if (payload.amount > senderWallet.balance) {
      throw new AppError(statusCode.BAD_REQUEST, "Insufficient balance.");
    }
    // cash-in charge free


    const receiverAccountInfo = await User.findOne({
      phone: payload.sendTo,
    });

    const receiverWallet = await Wallet.findOne({
      _id: receiverAccountInfo?.wallet,
    }).session(session);
    if (!receiverWallet) {
      throw new AppError(statusCode.NOT_FOUND, "Receiver wallet not found.");
    }
    if (receiverWallet.status !== "active") {
      throw new AppError(
        statusCode.BAD_REQUEST,
        "Only active wallets can receive money."
      );
    }

    senderWallet.balance = Number(senderWallet.balance) - Number(payload.amount);
    await senderWallet.save({ session });

    receiverWallet.balance = Number(receiverWallet.balance) + Number(payload.amount);
    await receiverWallet.save({ session });

    // create transaction
    const transaction = await Transaction.create(
      [{
          transactionId: generateTransitionId(),
          type: "top-up",
          senderId: senderWallet.user,
          receiverId: receiverWallet.user,
          sentBy: req.body.sendTo,
          charge: {
            currentBalance: Number(senderWallet.balance) + Number(req.body.amount),
            requestedSendingAmount:  req.body.amount,
            serviceChargeForSendMoneySet: `TK 0`,
            amountWithCharge: req.body.amount ,
          },
          status: "completed",
        },
      ],
      { session }
    );

    if (!transaction.length) {
      throw new AppError(
        statusCode.BAD_REQUEST,
        "Failed to create transaction history"
      );
    }

    await session.commitTransaction();
    session.endSession();

    return { senderWallet, receiverWallet, transaction: transaction[0] };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const cashOut = async (req: any) => {
  const payload:  {amount: number, sendTo: string } = req.body;

  if (payload.amount < 10) {
    throw new AppError(
      statusCode.BAD_REQUEST,
      "Amount must be higher than 10."
    );
  }

  const session = await Wallet.startSession();
  session.startTransaction();
  try {
    const senderWallet = await Wallet.findOne({
      user: req.token_user_info._id,
    }).session(session);
    if (!senderWallet) {
      throw new AppError(statusCode.NOT_FOUND, "Your Wallet not found.");
    }

    if (senderWallet.status !== "active") {
      throw new AppError(
        statusCode.BAD_REQUEST,
        "Only active wallets can cash-out."
      );
    }

    // calculate amount with charge
    const serviceCharge = await Charge.findOne({ slug: "service-charge" });
    if (!serviceCharge) {
      throw new AppError(statusCode.NOT_FOUND, "Service charge not found.");
    }

    const amountWithCharge =
      payload.amount +
      (serviceCharge.withdrawalFeePercentage * payload.amount) / 100;
    if (amountWithCharge > senderWallet.balance) {
      throw new AppError(statusCode.BAD_REQUEST, "Insufficient balance.");
    }






    // const receiveInfo = await User.findOne({ phone: payload.sendTo });


    const receiverAccount = await User.findOne({
      phone: payload.sendTo,
    }).session(session);
    if (!receiverAccount) {
      throw new AppError(statusCode.NOT_FOUND, "Receiver account not found.");
    }
    if (!receiverAccount?.role?.includes(TUserRole.AGENT)) {
      throw new AppError(
        statusCode.NOT_FOUND,
        "Cash-out amount can only send to agent account."
      );
    }
    const receiverWallet = await Wallet.findOne({ user: receiverAccount._id })
      .populate("user")
      .session(session);
    if (!receiverWallet) {
      throw new AppError(statusCode.NOT_FOUND, "Receiver wallet not found.");
    }
    if (receiverWallet.status !== "active") {
      throw new AppError(
        statusCode.BAD_REQUEST,
        "Only active wallets can receive money."
      );
    }

    senderWallet.balance = Number(senderWallet.balance) -  Number(amountWithCharge);
    await senderWallet.save({ session });

    receiverWallet.balance += payload.amount;
    await receiverWallet.save({ session });

    // create transaction
    const transaction = await Transaction.create(
      [
        {
          transactionId: generateTransitionId(),
          type: "cash-out",
          senderId: senderWallet.user,
          receiverId: receiverWallet.user,
          sentBy: req.body.sendTo,
          charge: {
            currentBalance: senderWallet?.balance,
            requestedSendingAmount:  req.body.amount,
            serviceChargeForSendMoneySet: `TK ${serviceCharge.sendMoneyCost}`,
            amountWithCharge: amountWithCharge ,
          },
          status: "completed",
        },
      ],
      { session }
    );

    if (!transaction.length) {
      throw new AppError(
        statusCode.BAD_REQUEST,
        "Failed to create transaction history"
      );
    }

    await session.commitTransaction();
    session.endSession();

    return { senderWallet, receiverWallet, transaction: transaction[0] };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const WalletServices = {
  createWallet,
  getWalletByUserId,
  sendMoney,
  topUp,
  walletStatus,
  cashIn,
  cashOut,
};

export default WalletServices;
