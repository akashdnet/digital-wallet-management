import { Request } from "express";
import { envList } from "../../config/envList";
import AppError from "../../utils/AppError";
import statusCode from "../../utils/statusCodes";
import { TAuthProvider, TUser, TUserRole } from "./user.interface";
import { User } from "./user.model";
import bcrypt from "bcryptjs"
import { Wallet } from "../wallet/wallet.model";



 const createUser= async (payload: TUser) => {
    const session = await User.startSession();
    session.startTransaction();
    try {
        const { email, password, ...rest } = payload;

        const isUserExist = await User.findOne({ email }).session(session);

        if (isUserExist) {
            throw new AppError(statusCode.BAD_REQUEST, "User Already Exist!!");
        }

        const hashedPassword = await bcrypt.hash(password!, envList.BCRYPT_SALT_ROUND);

        const authProvider: TAuthProvider = { provider: "credential", providerId: email as string };

        const user = await User.create([{
            email,
            password: hashedPassword,
            authProviders: [authProvider],
            agentStatus: "idk",
            ...rest
        }], { session });

        if (!user.length) {
            throw new AppError(statusCode.BAD_REQUEST, "Failed to create user");
        }

        const wallet = await Wallet.create([{
            user: user[0]._id,
            balance: 50,
        }], { session });

        if (!wallet.length) {
            throw new AppError(statusCode.BAD_REQUEST, "Failed to create wallet for user");
        }

        const updatedUser = await User.findByIdAndUpdate(
            user[0]._id,
            { wallet: wallet[0]._id },
            { new: true, session }
        ).populate("wallet");


        await session.commitTransaction();
        session.endSession();

        return updatedUser;
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
};





 const getAllUsers = async () => {
  const users = await User.find().populate("wallet");
  const total = await User.countDocuments();
  return {
    users,
    total
  };
};







 const getSingleUser = async (req:Request, id: string) => {
  const result = await User.findById(id).select("-password").populate("wallet");
  if(!result){
    throw new AppError(statusCode.NOT_FOUND, "User Not found.")
  }
  
  return result;
};






 const myProfile = async (req:Request) => {
  const result = await User.findById(req.decodedToken?.userId).select("-password");
  if(!result){
    throw new AppError(statusCode.NOT_FOUND, "User Not found.")
  }
  
  return result;
};








 const updateUser = async (req:Request, id: string, payload: Partial<TUser>) => {
  
    const {password, role, agentStatus, wallet,  ...rest} = payload;
    

    const authPayload = req.token_user_info.role.includes(TUserRole.ADMIN) ? {
      role,
      agentStatus,
      wallet
     }:{}


  const result = await User.findByIdAndUpdate(id, {...rest, ...authPayload }, {
    new: true,
  });


  return result;
};







 const deleteUser = async (req:Request, id: string) => {


  const tokenUser = await User.findById(req.decodedToken?.userId)
  if(!tokenUser?.role?.includes(TUserRole.ADMIN) && tokenUser?._id?.toString() !== id){
    throw new AppError(statusCode.FORBIDDEN, "You are not authorized.")
  }


  const result = await User.findByIdAndDelete(id);
  if(!result){
    throw new AppError(statusCode.NOT_FOUND, "User not found.")
  }
  return result;
};



















 const UserServices = {
  createUser,
  getAllUsers,
  getSingleUser,
  updateUser,
  deleteUser,
  myProfile,
};

export default UserServices;