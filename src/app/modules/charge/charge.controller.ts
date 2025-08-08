import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import statusCode from "../../utils/statusCodes";
import { ChargeServices } from "./charge.service";

const getCharge = catchAsync(async (req: Request, res: Response) => {
  const result = await ChargeServices.getCharge();

  sendResponse(res, {
    statusCode: statusCode.OK,
    success: true,
    message: "Charge retrieved successfully",
    data: result,
  });
});

const updateCharge = catchAsync(async (req: Request, res: Response) => {
  const result = await ChargeServices.updateCharge(req.body);

  sendResponse(res, {
    statusCode: statusCode.OK,
    success: true,
    message: "Charge updated successfully",
    data: result,
  });
});

export const ChargeControllers = {
  getCharge,
  updateCharge,
};
