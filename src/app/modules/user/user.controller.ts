import { Request, Response } from "express";
import UserServices from "./user.service";
import statusCode from "../../utils/statusCodes";
import { sendResponse } from "../../utils/sendResponse";
import { catchAsync } from "../../utils/catchAsync";
import AppError from "../../utils/AppError";
import { TUserRole, TUser } from "./user.interface";





const createUser = catchAsync(async (req: Request, res: Response) => {
  const payload:{
    data: Partial<TUser>;
    file: Express.Multer.File;
}
 = {
    data : req.body,
    file: req.file!,
  }
  const result = await UserServices.createUser(payload);


  sendResponse(res, {
    statusCode: statusCode.CREATED,
    success: true,
    message: "User created successfully",
    data: result,
  });
});

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const result = await UserServices.getAllUsers();

  sendResponse(res, {
    statusCode: statusCode.OK,
    success: true,
    message: "Users retrieved successfully",
    data: result.users,
    meta: {
      totalUsers: result.total
    }
  });
});


const getSingleUser = catchAsync(async (req: Request, res: Response) => {
  
  const { id } = req.params;
  if(!id){
    throw new AppError(statusCode.NOT_FOUND, "Please select user id.")
  }
  const user = await UserServices.getSingleUser(req, id);
  sendResponse(res, {
    statusCode: statusCode.OK,
    success: true,
    message: "User retrieved successfully",
    data: user
  });
});





const myProfile = catchAsync(async (req: Request, res: Response) => {
  
  const user = await UserServices.myProfile(req);
  sendResponse(res, {
    statusCode: statusCode.OK,
    success: true,
    message: "User retrieved successfully",
    data: user
  });
});



const updateUser = catchAsync(async (req: Request, res: Response) => {

  const { id } = req.params;



  const result = await UserServices.updateUser(req, id, req.body);

  sendResponse(res, {
    statusCode: statusCode.OK,
    success: true,
    message: "User updated successfully",
    data: result,
  });
});




const deleteUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  if(!id){
    throw new AppError(statusCode.BAD_REQUEST, "Please select user id.")
  }
  const result = await UserServices.deleteUser(req, id);

  res.status(statusCode.OK).json({
    success: true,
    message: "User deleted successfully",
    data: result,
  });
});

export const UserControllers = {
  createUser,
  getAllUsers,
  getSingleUser,
  updateUser,
  deleteUser,
  myProfile,
};