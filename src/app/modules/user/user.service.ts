import { Request } from "express";
import { envList } from "../../config/envList";
import AppError from "../../utils/AppError";
import statusCode from "../../utils/statusCodes";
import { TAuthProvider, TUser, TUserRole } from "./user.interface";
import { User } from "./user.model";
import bcrypt from "bcryptjs"
import { Wallet } from "../wallet/wallet.model";
import { deleteCloudinaryImage } from "../../config/cloudinary";
import { Transaction } from "../transaction/transaction.model";



 const create = async (payload: {
  data: Partial<TUser>;
  file: Express.Multer.File;
}) => {
  const session = await User.startSession();
  session.startTransaction();
  try {
    const { name, email, password, phone, role } = payload.data;

    
    const isUserExist = await User.findOne({ email }).session(session);
    if (isUserExist) {
      throw new AppError(statusCode.BAD_REQUEST, "User with this email already exists!");
    }

    
    const isUserExist2 = await User.findOne({ phone }).session(session);
    if (isUserExist2) {
      throw new AppError(statusCode.BAD_REQUEST, "User with this phone number already exists!");
    }



    const authProvider: TAuthProvider = {
      provider: "credential",
      providerId: email as string,
    };

    const user = await User.create(
      [
        {
          name,
          email,
          phone, 
          avatar: payload?.file?.path,
          password: password ,
          authProviders: [authProvider],
          role: role || TUserRole.USER,
        },
      ],
      { session }
    );

    if (!user.length) {
      throw new AppError(statusCode.BAD_REQUEST, "Failed to create account.");
    }

    const wallet = await Wallet.create(
      [
        {
          user: user[0]._id,
          balance: 50,
        },
      ],
      { session }
    );

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

    if (payload.file) {
      await deleteCloudinaryImage(payload.file.path);
    }

    session.endSession();
    throw error;
  }
};








const me = async (req:Request) => {
  const userInfo = await User.findById(req.decodedToken?.userId ).select("-password").populate("wallet");
 
  const transactions = await Transaction.find({
      $or: [
        { to: req.token_user_info?.phone }, 
        { from: req.token_user_info?.phone }, 
        { fromUserID: req.token_user_info?._id }, 
        {toUserID: req.token_user_info?._id },
      ]
    }).sort({ createdAt: -1 }).limit(5); 
     

    // console.log(transactions)

  const result = {userInfo,transactions}

  if(!result.userInfo){
    throw new AppError(statusCode.NOT_FOUND, "User Not found.")
  }
  
  return result;
};



const update = async (payload:any) => {


  console.log(`user service:`, payload.data)

  // console.log(`update mmy profile payload.decodedToken.userId:`,  payload.decodedToken.userId)
  console.log(`payload data:`, payload.data)


  
  if(payload.decodedToken.userId !== payload.data.id){
    console.log(`Unauthorized profile update request: payload id: ${payload.data.id}, token id: ${payload.decodedToken.userId}`)
    throw new AppError(statusCode.UNAUTHORIZED, "You are not authorized."  )
  }


  const result = await User.findByIdAndUpdate(payload.decodedToken.userId, {...payload.data, avatar: payload.file?.path}, { new: true, runValidators: true })
  if(!result){
    throw new AppError(statusCode.NOT_FOUND, "User Not found.")
  }
  
  return result;
};



const changePassword = async (payload:any) => {
  const { oldPassword, newPassword, id } = payload;

  console.log(`change password: `, payload)

    const user = await User.findById(id);
    if (!user) {
        throw new AppError(statusCode.NOT_FOUND, "User not found");
    }


  const isMatch = await bcrypt.compare(oldPassword, user.password!);

  if (!isMatch) {
    throw new AppError(statusCode.UNAUTHORIZED, "Old password is incorrect");
  }
  
  user.password = newPassword;
  await user.save();

  return { message: "Password changed successfully" };

  

}






















 const UserServices = {
  create,
  me,
  update,
  changePassword,

};

export default UserServices;