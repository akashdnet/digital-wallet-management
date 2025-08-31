import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import path from "path";



const getAllPost = catchAsync(async (req: Request, res: Response) => {

res.sendFile(path.join(__dirname, "posts.json"));

});








export const TestControllers = {
  getAllPost,
};
