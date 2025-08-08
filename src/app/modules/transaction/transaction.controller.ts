import { Request, Response } from "express";
import statusCode from "../../utils/statusCodes";
import { catchAsync } from "../../utils/catchAsync";
import { TransactionServices } from "./transaction.service";

const fetchAllTransactions = catchAsync(async (req: Request, res: Response) => {
  const result = await TransactionServices.fetchAllTransactions();

  res.status(statusCode.OK).json({
    success: true,
    message: "Fetched transactions successfully",
    data: result,
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





export const TransactionControllers = {
  fetchAllTransactions,
    getUserTransaction,
};
