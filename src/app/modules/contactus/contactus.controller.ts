import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import statusCode from "../../utils/statusCodes";
import { ContactUsServices } from "./contactus.service";

const create = catchAsync(async (req: Request, res: Response) => {
    const result = await ContactUsServices.create(req.body);

    sendResponse(res, {
        statusCode: statusCode.OK,
        success: true,
        message: "Message sent successfully",
        data: result,
    });
});

const getAll = catchAsync(async (req: Request, res: Response) => {
    const result = await ContactUsServices.getAll();

    sendResponse(res, {
        statusCode: statusCode.OK,
        success: true,
        message: "Messages retrieved successfully",
        data: result,
    });
});

export const ContactUsControllers = {
    create,
    getAll,
};
