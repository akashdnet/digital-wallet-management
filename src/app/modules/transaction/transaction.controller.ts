import { Request, Response } from "express";
import statusCode from "../../utils/statusCodes";
import { catchAsync } from "../../utils/catchAsync";
import { TransactionServices } from "./transaction.service";

const fetchAllTransactions = catchAsync(async (req: Request, res: Response) => {
  const result = await TransactionServices.fetchAllTransactions();

  res.status(statusCode.OK).json({
    success: true,
    message: "Fetched transactions successfully",
    meta: {
      totalTransactions: result.totalTransactions
    },
    data: result.transactions,
  });
});


const fetchMyAllTransactions = catchAsync(async (req: Request, res: Response) => {
  const payload = {...req.token_user_info, queries:req.query}
  const result = await TransactionServices.fetchMyAllTransactions(payload);

  res.status(statusCode.OK).json({
    success: true,
    message: "Fetched transactions successfully",
    data: result.transactions,
    meta: result.meta
  });
});



const getUserTransaction = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await TransactionServices.getUserTransaction(id);

  res.status(statusCode.OK).json({
    success: true,
    message: "Fetched transaction successfully",
    data: result.transactions,
    meta: {
      totalTransactions: result.totalTransactions
    },
  });
});


const test = catchAsync(async (req: Request, res: Response) => {
  // const { id } = req.params;
  const result = await TransactionServices.test(req.body);

  res.status(statusCode.OK).json({
    success: true,
    message: "Transaction created successfully.",
    data: result,
  });
});





export const TransactionControllers = {
  fetchAllTransactions,
  fetchMyAllTransactions,
    getUserTransaction,
    test,
};
