import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import statusCode from "../../utils/statusCodes";
import AdminServices from "./admin.service";
import { ObjectId } from "mongoose";


const dashboardOverview = catchAsync(async (req: Request, res: Response) => {

  const result = await AdminServices.dashboardOverview();

  sendResponse(res, {
    statusCode: statusCode.OK,
    success: true,
    message: "Dashboard Overview retrieved successfully",
    data: result,
  });
});


const updateUserProfile = catchAsync(async (req: Request, res: Response) => {

  const result = await AdminServices.updateUserProfile(req.body);

  sendResponse(res, {
    statusCode: statusCode.OK,
    success: true,
    message: "User Profile updated successfully",
    data: result,
  });
});



const deleteUser = catchAsync(async (req: Request, res: Response) => {

  const { id }:any = req.params;

  const result = await AdminServices.deleteUser(id);

  sendResponse(res, {
    statusCode: statusCode.OK,
    success: true,
    message: "User deleted successfully",
    data: result,
  });
});







export const AdminControllers = {
 dashboardOverview,
 updateUserProfile,
 deleteUser,
};
