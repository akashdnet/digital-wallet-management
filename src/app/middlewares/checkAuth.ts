import { NextFunction, Request, Response } from "express";
import { User } from "../modules/user/user.model";
import { JwtPayload } from "jsonwebtoken";
import httpStatus from "http-status-codes";
import AppError from "../utils/AppError";
import statusCode from "../utils/statusCodes";
import { verifyToken } from "../modules/auth/jwt";
import { envList } from "../config/envList";
import { TUserRole } from "../modules/user/user.interface";

export const checkAuth =
  (...authRoles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const accessToken = req.headers.authorization;

      // login check
      if (!accessToken) {
        throw new AppError(statusCode.BAD_REQUEST, "Please Login.");
      }

      // token check
      const verifiedToken = verifyToken(
        accessToken,
        envList.JWT_ACCESS_SECRET
      ) as JwtPayload;
      const isUserExist = await User.findById(verifiedToken.userId);
      if (!isUserExist) {
        throw new AppError(httpStatus.BAD_REQUEST, "User does not exist");
      }

      // account status check
      // if (
      //   isUserExist.status === "blocked" ||
      //   isUserExist.status === "pending"
      // ) {
      //   throw new AppError(
      //     httpStatus.BAD_REQUEST,
      //     `Unauthorize access!: ${isUserExist.status} account cant be access this route`
      //   );
      // }

      // role - authorization check
      const authorization = isUserExist.role?.some((role) =>
        authRoles.includes(role)
      );
      if (!authorization) {
        throw new AppError(403, "[role based]: Unauthorize access!");
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
