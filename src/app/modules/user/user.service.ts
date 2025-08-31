import { Request } from "express";
import { envList } from "../../config/envList";
import AppError from "../../utils/AppError";
import statusCode from "../../utils/statusCodes";
import { TAuthProvider, TUser, TUserRole } from "./user.interface";
import { User } from "./user.model";
import bcrypt from "bcryptjs"
import { Wallet } from "../wallet/wallet.model";
import { deleteCloudinaryImage } from "../../config/cloudinary";
import is from "zod/v4/locales/is.cjs";
import { Transaction } from "../transaction/transaction.model";



 const createUser= async (payload :{
    data: Partial<TUser>;
    file: Express.Multer.File;
}) => {
    const session = await User.startSession();
    session.startTransaction();
    try {
        const { email, password, phone, role, ...rest } = payload.data;

        const isUserExist = await User.findOne({ email }).session(session);

        if (isUserExist) {
            throw new AppError(statusCode.BAD_REQUEST, "User Already Exist!!");
        }

        const hashedPassword = await bcrypt.hash(password!, envList.BCRYPT_SALT_ROUND);

        const authProvider: TAuthProvider = { provider: "credential", providerId: email as string };

        const user = await User.create([{
            email,
            phone: Number(phone),
            avatar: payload.file.path, 
            password: hashedPassword,
            authProviders: [authProvider],
            agentStatus: role?.includes(TUserRole.AGENT) ? "pending" : "idk" ,
            role: [TUserRole.USER],
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

        if(payload.file){
          await deleteCloudinaryImage(payload.file.path)

        }
        session.endSession();
        throw error;
    }
};

const myProfile = async (req:Request) => {
  const userInfo = await User.findById(req.decodedToken?.userId ).select("-password").populate("wallet");
 
  const transactions = await Transaction.find({
      $or: [{ senderId: req.decodedToken?.userId }, { receiverId: req.decodedToken?.userId }]
    }).sort({ createdAt: -1 }); 
     

    // console.log(transactions)

  const result = {userInfo,transactions}

  if(!result.userInfo){
    throw new AppError(statusCode.NOT_FOUND, "User Not found.")
  }
  
  return result;
};



const updateMyProfile = async (payload:any) => {

  // console.log(`update mmy profile payload.decodedToken.userId:`,  payload.decodedToken.userId)
  console.log(`payload data:`, payload.data)

  const result = await User.findByIdAndUpdate(payload.decodedToken.userId, {...payload.data, avatar: payload.file?.path}, { new: true, runValidators: true })
  if(!result){
    throw new AppError(statusCode.NOT_FOUND, "User Not found.")
  }
  
  return result;
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






 const updateUser = async (req:Request, id: string, payload: Partial<TUser>) => {
  
    const {password, role, agentStatus, wallet, authProviders, _id,  ...rest} = payload;
    
    

    const authPayload = req.token_user_info.role.includes(TUserRole.ADMIN) ? {
      role,
      agentStatus,
      wallet
     }:{}


     const isUserExist = await User.findById(payload._id)

     




  const result = await User.findByIdAndUpdate(id, {...rest, phone: Number(payload.phone), ...authPayload }, {
    new: true,
  });


  if(payload.avatar && isUserExist?.avatar && isUserExist.avatar !== payload.avatar){
      await deleteCloudinaryImage(isUserExist.avatar)
     }

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

  if(result.avatar){
    await deleteCloudinaryImage(result.avatar)
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
  updateMyProfile
};

export default UserServices;