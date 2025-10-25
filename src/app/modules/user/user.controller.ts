import { Request, Response } from "express";
import UserServices from "./user.service";
import statusCode from "../../utils/statusCodes";
import { sendResponse } from "../../utils/sendResponse";
import { catchAsync } from "../../utils/catchAsync";
import AppError from "../../utils/AppError";
import { TUserRole, TUser } from "./user.interface";





const create = catchAsync(async (req: Request, res: Response) => {

  const payload = { data: req.body, file: req.file! }
  const result = await UserServices.create(payload);

  sendResponse(res, {
    statusCode: statusCode.OK,
    success: true,
    message: "Profile created successfully",
    data: result,
  });
});



const update = catchAsync(async (req: Request, res: Response) => {

  const payload= { data : req.body, file: req.file!, decodedToken:req.decodedToken }
  const result = await UserServices.update(payload);


  sendResponse(res, {
    statusCode: statusCode.OK,
    success: true,
    message: "Profile updated successfully",
    data: result,
  });
});




const changePassword = catchAsync(async (req: Request, res: Response) => {
  


  
  const payload:any= { 
    id: req.decodedToken.userId ,
    oldPassword:req.body.oldPassword, 
    newPassword:req.body.newPassword, 
  }
  const result = await UserServices.changePassword(payload);


  sendResponse(res, {
    statusCode: statusCode.CREATED,
    success: true,
    message: "Password changed successfully.",
    data: result,
  });
});


















const me = catchAsync(async (req: Request, res: Response) => {
  
  const user = await UserServices.me(req);
  sendResponse(res, {
    statusCode: statusCode.OK,
    success: true,
    message: "User retrieved successfully",
    data: user
  });
});









export const UserControllers = {
    create,
  me,
  update,
  changePassword,


};