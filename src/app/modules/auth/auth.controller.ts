import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import passport from "passport";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import AppError from "../../utils/AppError";
import { createUserTokens } from "./jwt";
import { setAuthCookie } from "../../utils/setCookies";
import { envList } from "../../config/envList";
import jwt, { JwtPayload } from "jsonwebtoken";
import { User } from "../user/user.model";


const credentialsLogin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate("local", async (err: any, user: any, info: any) => {
      if (err) {
        return next(new AppError(401, err));
      }
      if (!user) {
        return next(new AppError(401, info.message));
      }

      const userTokens = createUserTokens(user);

      const { password: pass, ...rest } = user.toObject();

      setAuthCookie(res, userTokens);

      sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "User Logged In Successfully",
        data: {
          accessToken: userTokens.accessToken,
          refreshToken: userTokens.refreshToken,
          user: rest,
        },
      });
    })(req, res, next);
  }
);


const logout = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Logged Out Successfully",
      data: null,
    });
  }
);





const refreshToken = catchAsync(
  
  async (req: Request, res: Response, next: NextFunction) => {
    
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return next(new AppError(httpStatus.UNAUTHORIZED, "Refresh token not found"));
    }

    try {
      
      const decoded = jwt.verify(
        refreshToken,
        envList.JWT_REFRESH_SECRET
      ) as JwtPayload;


      // console.log(`decodeeee:   `, decoded)

      const user = await User.findById(decoded.userId);
      if (!user) {
        return next(new AppError(httpStatus.UNAUTHORIZED, "User not found"));
      }

      
      const newTokens = createUserTokens(user);

      
      setAuthCookie(res, newTokens);

      
      sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Access token refreshed successfully",
        data: {
          accessToken: newTokens.accessToken,
        },
      });
    } catch (error) {
      return next(new AppError(httpStatus.UNAUTHORIZED, "Invalid or expired refresh token"));
    }
  }
);







export const AuthControllers = {
  credentialsLogin,
  logout,
  refreshToken,
};
