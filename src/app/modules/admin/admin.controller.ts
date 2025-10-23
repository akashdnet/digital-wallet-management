import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import statusCode from "../../utils/statusCodes";
import AdminServices from "./admin.service";
import { ObjectId } from "mongoose";


// done 

const dashboardOverview = catchAsync(async (req: Request, res: Response) => {

  const result = await AdminServices.dashboardOverview();

  sendResponse(res, {
    statusCode: statusCode.OK,
    success: true,
    message: "Dashboard Overview retrieved successfully",
    data: result,
  });
});




// done 
const fetchAllTransactions = catchAsync(async (req: Request, res: Response) => {
  const payload = {...req.token_user_info, queries:req.query}
  const result = await AdminServices.fetchAllTransactions(payload);

  res.status(statusCode.OK).json({
    success: true,
    message: "Fetched all type users transactions successfully",
    data: result.transactions,
    meta: result.meta
  });
});















// done 
const updateUserProfile = catchAsync(async (req: Request, res: Response) => {

  const result = await AdminServices.updateUserProfile(req.body, req.params.userId);

  sendResponse(res, {
    statusCode: statusCode.OK,
    success: true,
    message: "User Profile updated successfully",
    data: result,
  });
});



// done 
const deleteUser = catchAsync(async (req: Request, res: Response) => {

  const { userID }:any = req.params;

  const result = await AdminServices.deleteUser(userID);

  sendResponse(res, {
    statusCode: statusCode.OK,
    success: true,
    message: "User deleted successfully",
    data: result,
  });
});





// done 
const pendingUsers = catchAsync(async (req: Request, res: Response) => {

    const payload = {...req.token_user_info, queries:req.query}
    const result = await AdminServices.pendingUsers(payload);

    sendResponse(res, {
    statusCode: statusCode.OK,
    success: true,
    message: "Fetched pending users successfully.",
    data: result.data,
    meta: result.meta,
  });


})





// done 
const userList = catchAsync(async (req: Request, res: Response) => {

    const payload = {...req.token_user_info, queries:req.query}
    const result = await AdminServices.userList(payload);

    sendResponse(res, {
    statusCode: statusCode.OK,
    success: true,
    message: "Fetched users successfully.",
    data: result.data,
    meta: result.meta,
  });


})




// done 
const agentList = catchAsync(async (req: Request, res: Response) => {

    const payload = {...req.token_user_info, queries:req.query}
    const result = await AdminServices.agentList(payload);

    sendResponse(res, {
    statusCode: statusCode.OK,
    success: true,
    message: "Fetched agents successfully.",
    data: result.data,
    meta: result.meta,
  });


})





// done 
const updateWalletStatus = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.params;
  const { status } = req.body;

  const payload = {
    ...req.token_user_info,
    userId,
    status,
  };

  const result = await AdminServices.updateWalletStatus(payload);

  sendResponse(res, {
    statusCode: statusCode.OK,
    success: true,
    message: "Wallet status updated successfully.",
     data: result,
  });
});



// done 
const pendingAgents = catchAsync(async (req: Request, res: Response) => {

    const payload = {...req.token_user_info, queries:req.query}
    const result = await AdminServices.pendingAgents(payload);

    sendResponse(res, {
    statusCode: statusCode.OK,
    success: true,
    message: "Fetched pending agents successfully.",
    data: result.data,
    meta: result.meta,
  });


})





export const AdminControllers = {
 dashboardOverview,
 updateUserProfile,
 deleteUser,
 pendingUsers,
 pendingAgents,
 fetchAllTransactions,
 updateWalletStatus,
 userList,
 agentList,
};
