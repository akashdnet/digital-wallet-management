import { Transaction } from "../transaction/transaction.model";
import { User } from "../user/user.model";
import { TUserRole } from "../user/user.interface";
import { UpdateUserProfileType } from "./admin.validation";
import { Wallet } from "../wallet/wallet.model";
import { startOfYear, endOfYear } from "date-fns";
import { TWalletStatus } from "../wallet/wallet.interface";
import { Types } from "mongoose";




// done 
const dashboardOverview = async () => {
  const totalTransactions = await Transaction.countDocuments();

  const stats = await User.aggregate([
    {
      $match: {
        role: { $in: ["user", "agent"] }
      }
    },
    {
      $lookup: {
        from: "wallets",
        localField: "_id",
        foreignField: "user",
        as: "wallet"
      }
    },
    {
      $set: {
        wallet: { $arrayElemAt: ["$wallet", 0] } 
      }
    },
    {
      $group: {
        _id: {
          role: "$role",
          status: { $ifNull: ["$wallet.status", "no_wallet"] }
        },
        count: { $sum: 1 }
      }
    },
    {
      $group: {
        _id: "$_id.role",
        breakdown: {
          $push: { k: "$_id.status", v: "$count" }
        },
        total: { $sum: "$count" }
      }
    },
    {
      $project: {
        role: "$_id",
        total: 1,
        breakdown: { $arrayToObject: "$breakdown" },
        _id: 0
      }
    },
    {
      $sort: { role: 1 }
    }
  ]);

  const year = new Date().getFullYear();

  const monthlyStats = await Transaction.aggregate([
    {
      $match: {
        date: {
          $gte: new Date(`${year}-01-01`),
          $lt: new Date(`${year + 1}-01-01`)
        }
      }
    },
    {
      $group: {
        _id: { month: { $month:  "$date" } },
        count: { $sum: 1 }
      }
    },
    {
      $project: {
        _id: 0,
        month: {
          $arrayElemAt: [
            ["", "January", "February", "March", "April", "May", "June",
             "July", "August", "September", "October", "November", "December"],
            "$_id.month"
          ]
        },
        count: 1
      }
    },
    { $sort: { month: 1 } }
  ]);

  return { stats, totalTransactions, monthlyStats };
};






// done 
const fetchAllTransactions = async (payload: any) => {

  const limit = Number(payload?.queries?.limit) || 10;
  const page = Number(payload?.queries?.page) || 1;
  const skip = (page - 1) * limit;
  const term = payload?.queries?.term || "";

  const filter: any = {
    // $or: [{ to: payload._id }, { from: payload._id }],
  };

  if (term) {
const filters: any[] = [
  { id: { $regex: term, $options: "i" } },
  { method: { $regex: term, $options: "i" } },
  { to: { $regex: term, $options: "i" } },
  { from: { $regex: term, $options: "i" } },
];


if (!isNaN(Number(term))) {
  filters.push({ amount: Number(term) });
}

filter.$and = [{ $or: filters }];

  }

  const totalTransactions = await Transaction.countDocuments(filter);

  const transactions = await Transaction.find(filter)
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(skip);

  return {
    transactions,
    meta: {
      totalTransactions,
      page,
      limit,
      totalPages: Math.ceil(totalTransactions / limit),
    },
  };
};







// done 
const updateUserProfile = async (payload: UpdateUserProfileType, id: string) => {
  const user = await User.findById(id);
  if (!user) {
    throw new Error("User not found");
  }

  user.name = payload.name;
  user.email = payload.email;
  user.phone = payload.phone;

  const isPhoneExist = await User.findOne({ phone: payload.phone });
  if (isPhoneExist && isPhoneExist._id.toString() !== id) {
    throw new Error("Phone number already exists");
  }


  if (payload.password) {
    user.password = payload.password; 
  }

  const result = await user.save(); 



  if(payload?.balance){
    const wallet = await Wallet.findOne({ user: id });
    if(!wallet){
      throw new Error("Wallet not found for this user. but user data is updated");
    }
    wallet.balance = Number(payload.balance);
    await wallet?.save();
   }








  return result;
};










// done 
const deleteUser = async (payload: string) => {
  
  if (!Types.ObjectId.isValid(payload)) {
    throw new Error(`Invalid user ID: ${payload}`);
  }

  const userId = new Types.ObjectId(payload);

    const session = await User.startSession();
  session.startTransaction();

  try {
    
    const isUserExist = await User.findById(userId).session(session);
    if (!isUserExist) {
      throw new Error("User not found");
    }

    
    const deleteUserProfile = await User.findByIdAndDelete(userId).session(session);
    
    if (!deleteUserProfile) {
      throw new Error("Failed to delete user profile");
    }
    const deleteUserWallet = await Wallet.findOneAndDelete({ user: userId }).session(session);

    


    await session.commitTransaction();
    session.endSession();

    return {
      deleteUserProfile,
      deleteUserWallet,
    };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error; 
  }
};






// done 
const pendingUsers = async (payload: any) => {

  const page = Number(payload?.queries?.page) || 1;
  const limit = Number(payload?.queries?.limit) || 5;
  const skip = (page - 1) * limit;
  const term = payload?.queries?.term || "";

  
  const pipeline: any[] = [
    
    { $match: { role: TUserRole.USER } },
    {
      $lookup: {
        from: "wallets",
        localField: "_id",
        foreignField: "user",
        as: "wallet"
      }
    },
    { $unwind: "$wallet" },
    { $match: { "wallet.status": "pending" } },
  ];

  
  if (term) {
    pipeline.push({
      $match: {
        $or: [
          { name: { $regex: term, $options: "i" } },
          { email: { $regex: term, $options: "i" } },
          { phone: { $regex: term, $options: "i" } },
        ]
      }
    });
  }

  
  const totalPipeline = [...pipeline, { $count: "total" }];
  const totalResult = await User.aggregate(totalPipeline);
  const totalUsers = totalResult[0]?.total || 0;

  const dataPipeline = [
    ...pipeline,
    { $sort: { createdAt: -1 } },
    { $skip: skip },
    { $limit: limit },
  ];

  const users = await User.aggregate(dataPipeline);

  return {
    data: users,
    meta: {
      total: totalUsers,
      page,
      limit,
      totalPages: Math.ceil(totalUsers / limit),
    },
  };
};






// done 
const userList = async (payload: any) => {

  const page = Number(payload?.queries?.page) || 1;
  const limit = Number(payload?.queries?.limit) || 5;
  const skip = (page - 1) * limit;
  const term = payload?.queries?.term || "";

  
  const pipeline: any[] = [
    
    { $match: { role: TUserRole.USER } },
    {
      $lookup: {
        from: "wallets",
        localField: "_id",
        foreignField: "user",
        as: "wallet"
      }
    },
    { $unwind: "$wallet" },
    { $match: { "wallet.status": { $ne: "pending" }
  } },
  ];

  
  if (term) {
    pipeline.push({
      $match: {
        $or: [
          { name: { $regex: term, $options: "i" } },
          { email: { $regex: term, $options: "i" } },
          { phone: { $regex: term, $options: "i" } },
        ]
      }
    });
  }

  
  const totalPipeline = [...pipeline, { $count: "total" }];
  const totalResult = await User.aggregate(totalPipeline);
  const totalUsers = totalResult[0]?.total || 0;

  const dataPipeline = [
    ...pipeline,
    { $sort: { createdAt: -1 } },
    { $skip: skip },
    { $limit: limit },
  ];

  const users = await User.aggregate(dataPipeline);

  return {
    data: users,
    meta: {
      total: totalUsers,
      page,
      limit,
      totalPages: Math.ceil(totalUsers / limit),
    },
  };
};




// done 
const agentList = async (payload: any) => {

  const page = Number(payload?.queries?.page) || 1;
  const limit = Number(payload?.queries?.limit) || 5;
  const skip = (page - 1) * limit;
  const term = payload?.queries?.term || "";

  
  const pipeline: any[] = [
    
    { $match: { role: TUserRole.AGENT } },
    {
      $lookup: {
        from: "wallets",
        localField: "_id",
        foreignField: "user",
        as: "wallet"
      }
    },
    { $unwind: "$wallet" },
    { $match: { "wallet.status": { $ne: "pending" }
  } },
  ];

  
  if (term) {
    pipeline.push({
      $match: {
        $or: [
          { name: { $regex: term, $options: "i" } },
          { email: { $regex: term, $options: "i" } },
          { phone: { $regex: term, $options: "i" } },
        ]
      }
    });
  }

  
  const totalPipeline = [...pipeline, { $count: "total" }];
  const totalResult = await User.aggregate(totalPipeline);
  const totalUsers = totalResult[0]?.total || 0;

  const dataPipeline = [
    ...pipeline,
    { $sort: { createdAt: -1 } },
    { $skip: skip },
    { $limit: limit },
  ];

  const users = await User.aggregate(dataPipeline);

  return {
    data: users,
    meta: {
      total: totalUsers,
      page,
      limit,
      totalPages: Math.ceil(totalUsers / limit),
    },
  };
};











// done 

interface IUpdateWalletStatus {
  userId: string;
  status: TWalletStatus;
}

const updateWalletStatus = async ({ userId, status }: IUpdateWalletStatus) => {
  
  if (!Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid user ID");
  }

  const wallet = await Wallet.findOne({ user: userId });
  if (!wallet) {
    throw new Error("Wallet not found for this user");
  }

  wallet.status = status;
  await wallet.save();

  return wallet;
};




















// done 
const pendingAgents = async (payload: any) => {

  const page = Number(payload?.queries?.page) || 1;
  const limit = Number(payload?.queries?.limit) || 5;
  const skip = (page - 1) * limit;
  const term = payload?.queries?.term || "";

  
  const pipeline: any[] = [
    
    { $match: { role: TUserRole.AGENT } },
    {
      $lookup: {
        from: "wallets",
        localField: "_id",
        foreignField: "user",
        as: "wallet"
      }
    },
    { $unwind: "$wallet" },
    { $match: { "wallet.status": "pending" } },
  ];

  
  if (term) {
    pipeline.push({
      $match: {
        $or: [
          { name: { $regex: term, $options: "i" } },
          { email: { $regex: term, $options: "i" } },
          { phone: { $regex: term, $options: "i" } },
        ]
      }
    });
  }

  
  const totalPipeline = [...pipeline, { $count: "total" }];
  const totalResult = await User.aggregate(totalPipeline);
  const totalUsers = totalResult[0]?.total || 0;

  const dataPipeline = [
    ...pipeline,
    { $sort: { createdAt: -1 } },
    { $skip: skip },
    { $limit: limit },
  ];

  const users = await User.aggregate(dataPipeline);

  return {
    data: users,
    meta: {
      total: totalUsers,
      page,
      limit,
      totalPages: Math.ceil(totalUsers / limit),
    },
  };
};












const AdminServices = {
  dashboardOverview,
  updateUserProfile,
  deleteUser,
  pendingUsers,
  pendingAgents,
  fetchAllTransactions,
  updateWalletStatus,
  userList,
  agentList,
};

export default AdminServices;
