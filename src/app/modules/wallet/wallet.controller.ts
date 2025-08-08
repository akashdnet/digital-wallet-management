import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import WalletServices from "./wallet.service";
import { sendResponse } from "../../utils/sendResponse";
import statusCode from "../../utils/statusCodes";
import AppError from "../../utils/AppError";

// const createWallet = catchAsync(async (req: Request, res: Response) => {
//   const userId = req.decodedToken.userId;
//   const result = await WalletServices.createWallet(userId);

//   sendResponse(res, {
//     statusCode: statusCode.CREATED,
//     success: true,
//     message: "Wallet created successfully",
//     data: result,
//   });
// });

const getWalletByUserId = catchAsync(async (req: Request, res: Response) => {
  const {id} = req.params;
  const result = await WalletServices.getWalletByUserId(id);

  sendResponse(res, {
    statusCode: statusCode.OK,
    success: true,
    message: "Wallet retrieved successfully",
    data: result,
  });
});





const walletStatus = catchAsync(async (req: Request, res: Response) => {
  if(!req.body){
    throw new AppError(statusCode.BAD_REQUEST, "Please provide wallet status data.");
  }
  const result = await WalletServices.walletStatus(req.body);

  sendResponse(res, {
    statusCode: statusCode.OK,
    success: true,
    message: "Wallet retrieved successfully",
    data: result,
  });
});


const  sendMoney = catchAsync(async (req: Request, res: Response) => {
    const result = await WalletServices.sendMoney(req);

    sendResponse(res, {
      statusCode: statusCode.OK,
      success: true,
      message: "Money sent successfully",
      data: result,
    });
  })

const  topUp = catchAsync(async (req: Request, res: Response) => {
    const result = await WalletServices.topUp(req);

    sendResponse(res, {
      statusCode: statusCode.OK,
      success: true,
      message: "Top-up successful",
      data: result,
    });
  })


const  cashIn = catchAsync(async (req: Request, res: Response) => {
    const result = await WalletServices.cashIn(req);

    sendResponse(res, {
      statusCode: statusCode.OK,
      success: true,
      message: "Money cashed in successfully",
      data: result,
    });
  })


const  cashOut = catchAsync(async (req: Request, res: Response) => {
    const result = await WalletServices.cashOut(req);

    sendResponse(res, {
      statusCode: statusCode.OK,
      success: true,
      message: "Money cashed out successfully",
      data: result,
    });
  })



export const WalletControllers = {
//   createWallet,
  getWalletByUserId,
  walletStatus,
  sendMoney,
  topUp,
  cashIn,
  cashOut,
};
