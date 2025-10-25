import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import { envList } from "../config/envList";
import { verifyToken } from "../modules/auth/jwt";
import { TUserRole } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";
import AppError from "../utils/AppError";
import statusCode from "../utils/statusCodes";

export const checkAuth = (...authRoles: string[]) => async (req: Request, res: Response, next: NextFunction) => {

    try {
      let accessToken = req.headers.authorization;
      if (!accessToken && req.cookies?.accessToken) {
        accessToken = req.cookies.accessToken;
      }

      // login check
      if (!accessToken) {
        throw new AppError(statusCode.BAD_REQUEST, "Please Login.");
      }


      // token check
      const verifiedToken = verifyToken(
        accessToken,
        envList.JWT_ACCESS_SECRET
      ) as JwtPayload;
      const isUserExist = await User.findById(verifiedToken.userId).populate("wallet")  ;
      if (!isUserExist) {
        throw new AppError(httpStatus.BAD_REQUEST, "User does not exist");
      }


      req.decodedToken = verifiedToken;
      req.token_user_info = isUserExist;
      



      const authorization = authRoles?.includes(isUserExist.role!);


      console.log("user role",isUserExist.role)
      console.log("check auth", authorization)


      if (!authorization) {
        throw new AppError(403, "Unauthorize access!");
      }




    



      // ownership - authorization check
    //   if (!isUserExist.role?.includes(TUserRole.ADMIN) && isUserExist.role?.includes(TUserRole.USER)){
      if (req.params.id && !isUserExist.role?.includes(TUserRole.ADMIN) && authRoles?.includes(TUserRole.USER) && verifiedToken.userId != req.params.id){              
          throw new AppError(403, "[Ownership based]Unauthorize access!");
      }
      







      req.decodedToken = verifiedToken;
      req.token_user_info = isUserExist;
 
      next();
    } catch (error) {
      console.log("jwt error", error);
      next(error);
    }
  };
