import { Transaction } from "../transaction/transaction.model";
import { User } from "../user/user.model";
import { TUserRole } from "../user/user.interface";
import { UpdateUserProfileType } from "./admin.validation";
import { Wallet } from "../wallet/wallet.model";
import { startOfYear, endOfYear } from "date-fns";

const dashboardOverview = async () => {


  const totalUserCount = await User.countDocuments({ role: TUserRole.USER });
  const totalAgentCount = await User.countDocuments({ role: TUserRole.AGENT });
  const userList = await User.find({ role: { $ne: TUserRole.AGENT } }).populate("wallet");
  const agentList = await User.find({role: { $eq: TUserRole.AGENT },}).populate("wallet");
  const adminList = await User.find({role: { $eq: TUserRole.ADMIN },}).populate("wallet");
  const transactionList = await Transaction.find();
  const totalTransactionCount =  transactionList?.length || 0;





   const monthNames = ["January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November", "December"];
  const currentYear = new Date().getFullYear();
  const start = startOfYear(new Date(currentYear, 0, 1));
  const end = endOfYear(new Date(currentYear, 11, 31));

  const stats = await Transaction.aggregate([
      {
        $match: {
          createdAt: { $gte: start, $lte: end },
        },
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { "_id": 1 },
      },
    ]);

   

    const transactionStats: Record<string, number> = {};
    for (let i = 0; i < 12; i++) {
      const monthName = monthNames[i];
      const found = stats.find((s) => s._id === i + 1);
      transactionStats[monthName] = found ? found.count : 0;
    }



  const statsUser = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: start, $lte: end },
        },
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { "_id": 1 },
      },
    ]);

   

    const userStats: Record<string, number> = {};
    for (let i = 0; i < 12; i++) {
      const monthName = monthNames[i];
      const found = statsUser.find((s) => s._id === i + 1);
      userStats[monthName] = found ? found.count : 0;
    }
















  const result = {
    totalUserCount,
    totalAgentCount,
    totalTransactionCount,
    userList,
    agentList,
    adminList,
    transactionList,
    transactionStats,
    userStats,
  };

  return result;
};

const updateUserProfile = async (payload: UpdateUserProfileType) => {
  const userPayload = {
    name: payload.name,
    email: payload.email,
    phone: payload.phone,
    role: payload.role,
    agentStatus: payload.agentStatus,
  };

  const walletPayload = {
    balance: payload.walletBalance,
    status: payload.walletStatus,
  };

  const isUserExist = await User.findOne({ _id: payload.id });
  if (!isUserExist) {
    throw new Error("User not found");
  }

  const updateUser = await User.findByIdAndUpdate(payload.id, userPayload, {
    new: true,
  });

  const updateWallet = await Wallet.findOneAndUpdate(
    { user: isUserExist._id },
    walletPayload,
    {
      new: true,
    }
  );

  const result = {
    updateUser,
    updateWallet,
  };

  return result;
};

const deleteUser = async (payload: any) => {
  console.log(`payload                     :`, payload);

  const isUserExist = await User.findOne({ _id: payload });
  if (!isUserExist) {
    throw new Error("User not found");
  }

  const deleteUserProfile = await User.findOneAndDelete({ _id: payload });

  const deleteUserWallet = await Wallet.findOneAndDelete({
    user: isUserExist._id,
  });

  const result = {
    deleteUserProfile,
    deleteUserWallet,
  };

  return result;
};

const AdminServices = {
  dashboardOverview,
  updateUserProfile,
  deleteUser,
};

export default AdminServices;
