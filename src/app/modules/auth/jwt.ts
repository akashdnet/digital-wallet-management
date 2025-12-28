import jwt, { JwtPayload, SignOptions } from "jsonwebtoken"
import { envList } from "../../config/envList"
import AppError from "../../utils/AppError"
import statusCode from "../../utils/statusCodes"
import { TUser } from "../user/user.interface"
import { User } from "../user/user.model"




// ---------------------
export const generateToken = (payload: JwtPayload, secret: string, expiresIn: string) => {

    const token = jwt.sign(payload, secret, { expiresIn } as SignOptions)

    return token
}

export const verifyToken = (token: string, secret: string) => {

    const verifiedToken = jwt.verify(token, secret);

    return verifiedToken
}








// ------------------

export const createUserTokens = (user: Partial<TUser>) => {
    const jwtPayload = {
        userId: user._id!.toString(),
        email: user.email!
    }
    const accessToken = generateToken(jwtPayload, envList.JWT_ACCESS_SECRET, envList.JWT_ACCESS_EXPIRES)
    const refreshToken = generateToken(jwtPayload, envList.JWT_REFRESH_SECRET, envList.JWT_REFRESH_EXPIRES)


    return {
        accessToken,
        refreshToken
    }
}

export const createNewAccessTokenWithRefreshToken = async (refreshToken: string) => {

    const verifiedRefreshToken = verifyToken(refreshToken, envList.JWT_REFRESH_SECRET) as JwtPayload


    const isUserExist = await User.findOne({ email: verifiedRefreshToken.email })
    if (!isUserExist) {
        throw new AppError(statusCode.BAD_REQUEST, "User does not exist")
    }

    if (isUserExist?.status === "blocked") {
        throw new AppError(statusCode.BAD_REQUEST, `User is ${isUserExist?.status}`)
    }

    const jwtPayload = {
        userId: isUserExist._id,
        email: isUserExist.email,
    }
    const accessToken = generateToken(jwtPayload, envList.JWT_ACCESS_SECRET, envList.JWT_ACCESS_EXPIRES)

    return accessToken
}