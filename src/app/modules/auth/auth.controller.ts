import { NextFunction, Request, Response } from "express"
import httpStatus from "http-status-codes"
import passport from "passport"
import { catchAsync } from "../../utils/catchAsync"
import { sendResponse } from "../../utils/sendResponse"
import AppError from "../../utils/AppError"
import { createUserTokens } from "./jwt"
import { setAuthCookie } from "../../utils/setCookies"
import { envList } from "../../config/envList"

const credentialsLogin = catchAsync(async (req: Request, res: Response, next: NextFunction) =>{
    
    
    
    
    passport.authenticate("local", async (err: any, user: any, info: any) =>{

        if(err){
            return next(new AppError(401, err))
        }
        if(!user){
            return next(new AppError(401, info.message))
        }



        const userTokens = createUserTokens(user)

        const { password: pass, ...rest } = user.toObject()


        setAuthCookie(res, userTokens)

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "User Logged In Successfully",
            data: {
                accessToken: userTokens.accessToken,
                refreshToken: userTokens.refreshToken,
                user: rest

            },
        })
    })(req, res, next)

})



// login + signup both 
const google = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const redirect = req.query.redirect || "/";
    passport.authenticate("google", {
      scope: ["profile", "email"],
      state: redirect as string,
    })(req, res, next);
  })


const googleCallbackController = catchAsync(async (req: Request, res: Response, next: NextFunction) =>{

    let redirectTo = req.query.state ? req.query.state as string : ""

    if(redirectTo.startsWith("/")){
        redirectTo = redirectTo.slice(1)
    }

    const user = req.user;
    if(!user){
        throw new AppError(httpStatus.NOT_FOUND, "User Not Found")
    }

    const tokenInfo = createUserTokens(user)

    setAuthCookie(res, tokenInfo)

    res.redirect(`${envList.AFTER_GOOGLE_LOGIN_SUCCESS_URL}/${redirectTo}`)
})







// logout 
const logout = catchAsync(async (req: Request, res: Response, next: NextFunction) =>{

    res.clearCookie("accessToken", {
        httpOnly: true,
        secure: false,
        sameSite: "lax"
    })

    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: false,
        sameSite: "lax"
    })

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "User Logged Out Successfully",
        data: null,
    })
})














export const AuthControllers = {
    credentialsLogin,
    google,
    googleCallbackController,
    logout,
}