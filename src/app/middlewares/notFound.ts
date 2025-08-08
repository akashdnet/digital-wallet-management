import { NextFunction, Request, Response } from "express";
import statusCode from "../utils/statusCodes";

 const notFound =(req:Request, res:Response, next:NextFunction)=>{
        
    res.status(statusCode.NOT_FOUND).json({
        success:false,
        message: "No route found",
    })
}

export default notFound;