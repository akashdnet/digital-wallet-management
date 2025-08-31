import { NextFunction, Request, Response } from "express"
import AppError from "../utils/AppError"
import { envList } from "../config/envList"
import { deleteCloudinaryImage } from "../config/cloudinary"

const globalErrorHandler = async (err: any, req: Request, res: Response, next: NextFunction) => {
    envList.NODE_ENV == "development" && console.log(err)

    if (req.file) {
        await deleteCloudinaryImage(req.file.path)
    }



    let statusCode = 500
    let message = "Something Went Wrong!"

    if(err instanceof AppError){
        statusCode = err.statusCode
        message = err.message
    }else if(err instanceof Error){
        statusCode = 500;
        message = err.message
    }else if (err.name === "JsonWebTokenError") {
        statusCode = 401;
        message = "Invalid Access Token!";
    } else if (err.name === "TokenExpiredError") {
        statusCode = 401;
        message = "Token Expired!";
    }


    res.status(statusCode).json({
        success: false,
        message,
        err,
        stack: envList.NODE_ENV === "development" ? err.stack : null
    })
}

export default globalErrorHandler