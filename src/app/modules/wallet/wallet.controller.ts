import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import WalletServices from "./wallet.service";
import { sendResponse } from "../../utils/sendResponse";
import statusCode from "../../utils/statusCodes";
import AppError from "../../utils/AppError";








const  sendMoney = catchAsync(async (req: Request, res: Response) => {
  const payload = {
    to: req.body.to,
    amount: req.body.amount,
    token_user_info: req.token_user_info,
  }
    const result = await WalletServices.sendMoney(payload);

    sendResponse(res, {
      statusCode: statusCode.OK,
      success: true,
      message: "Money sent successfully",
      data: result,
    });
  })




const  cashOut = catchAsync(async (req: Request, res: Response) => {
  const payload = {
    to: req.body.to,
    amount: req.body.amount,
    token_user_info: req.token_user_info,
  }
    const result = await WalletServices.cashOut(payload);

    sendResponse(res, {
      statusCode: statusCode.OK,
      success: true,
      message: "Successfully cash out done.",
      data: result,
    });
  })



const  cashIn = catchAsync(async (req: Request, res: Response) => {
  const payload = {
    to: req.body.to,
    amount: req.body.amount,
    token_user_info: req.token_user_info,
  }
    const result = await WalletServices.cashIn(payload);

    sendResponse(res, {
      statusCode: statusCode.OK,
      success: true,
      message: "Successfully cash in done.",
      data: result,
    });
  })






const  topUp = catchAsync(async (req: Request, res: Response) => {
  const payload = {
    to: req.body.to,
    amount: req.body.amount,
    token_user_info: req.token_user_info,
  }
    const result = await WalletServices.topUp(payload);

    sendResponse(res, {
      statusCode: statusCode.OK,
      success: true,
      message: "Successfully top up done.",
      data: result,
    });
  })
















export const WalletControllers = {

  sendMoney,
  topUp,
  cashIn,
  cashOut,
};
