import { TCharge } from "../modules/charge/charge.interface";
import { Charge } from "../modules/charge/charge.model";
import { Transaction } from "../modules/transaction/transaction.model";
import { TUser, TUserRole } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";
import { Wallet } from "../modules/wallet/wallet.model";
import { transactionsData } from "./transactionsData";

// const users:TUser[] = [
//   {
//     profile_image: "https://example.com/images/1.jpg",
//     name: "Ayesha Rahman",
//     email: "ayesha.rahman@example.com",
//     password: "$2b$10$X2tX1VgRmcNzZzQ6fL2znOWi0F56Lc6OC2pbCk5cHr665Y1gm9bxy",
//     authProviders: [
//       { provider: "credential", providerId: "ayesha.rahman@example.com" },
//     ],
//     role: [ TUserRole.USER, ],
//     status: "active",
//     balance: 100,
//     currency: "BDT",
//     agentStatus: "requested",
//   },
//   {
//     profile_image: "https://example.com/images/2.jpg",
//     name: "Tanvir Ahmed",
//     email: "tanvir.ahmed@example.com",
//     password: "$2b$10$X2tX1VgRmcNzZzQ6fL2znOWi0F56Lc6OC2pbCk5cHr665Y1gm9bxy",
//     authProviders: [
//       { provider: "google", providerId: "tanvir.ahmed@example.com" },
//     ],
//     role: [TUserRole.USER, TUserRole.AGENT],
//     status: "blocked",
//     balance: 0,
//     currency: "BDT",
//     agentStatus: "suspended",
//   },
//   {
//     profile_image: "https://example.com/images/3.jpg",
//     name: "Nusrat Jahan",
//     email: "nusrat.jahan@example.com",
//     password: "$2b$10$X2tX1VgRmcNzZzQ6fL2znOWi0F56Lc6OC2pbCk5cHr665Y1gm9bxy",
//     authProviders: [
//       { provider: "credential", providerId: "nusrat.jahan@example.com" },
//     ],
//     role: [TUserRole.USER, TUserRole.ADMIN ],
//     status: "pending",
//     balance: 75,
//     currency: "BDT",
//     agentStatus: "approved",
//   },
//   {
//     profile_image: "https://example.com/images/4.jpg",
//     name: "Rafiul Islam",
//     email: "rafiul.islam@example.com",
//     password: "$2b$10$X2tX1VgRmcNzZzQ6fL2znOWi0F56Lc6OC2pbCk5cHr665Y1gm9bxy",
//     authProviders: [
//       { provider: "google", providerId: "rafiul.islam@example.com" },
//     ],
//     role: [TUserRole.USER, TUserRole.AGENT],
//     status: "active",
//     balance: 50,
//     currency: "BDT",
//     agentStatus: "idk",
//   },
//   {
//     profile_image: "https://example.com/images/5.jpg",
//     name: "Meherun Nesa",
//     email: "meherun.nesa@example.com",
//     password: "$2b$10$X2tX1VgRmcNzZzQ6fL2znOWi0F56Lc6OC2pbCk5cHr665Y1gm9bxy",
//     authProviders: [
//       { provider: "credential", providerId: "meherun.nesa@example.com" },
//     ],
//     role: [TUserRole.USER, TUserRole.AGENT,],
//     status: "active",
//     balance: 200,
//     currency: "BDT",
//     agentStatus: "approved",
//   },
//   {
//     profile_image: "https://example.com/images/6.jpg",
//     name: "Shakib Hasan",
//     email: "shakib.hasan@example.com",
//     password: "$2b$10$X2tX1VgRmcNzZzQ6fL2znOWi0F56Lc6OC2pbCk5cHr665Y1gm9bxy",
//     authProviders: [
//       { provider: "google", providerId: "shakib.hasan@example.com" },
//     ],
//     role: [ TUserRole.USER, TUserRole.ADMIN ],
//     status: "pending",
//     balance: 30,
//     currency: "BDT",
//     agentStatus: "requested",
//   },
//   {
//     profile_image: "https://example.com/images/7.jpg",
//     name: "Farzana Kabir",
//     email: "farzana.kabir@example.com",
//     password: "$2b$10$X2tX1VgRmcNzZzQ6fL2znOWi0F56Lc6OC2pbCk5cHr665Y1gm9bxy",
//     authProviders: [
//       { provider: "credential", providerId: "farzana.kabir@example.com" },
//     ],
//     role: [TUserRole.USER],
//     status: "blocked",
//     balance: 10,
//     currency: "BDT",
//     agentStatus: "rejected",
//   },
//   {
//     profile_image: "https://example.com/images/8.jpg",
//     name: "Imran Hossain",
//     email: "imran.hossain@example.com",
//     password: "$2b$10$X2tX1VgRmcNzZzQ6fL2znOWi0F56Lc6OC2pbCk5cHr665Y1gm9bxy",
//     authProviders: [
//       { provider: "google", providerId: "imran.hossain@example.com" },
//     ],
//     role: [TUserRole.USER],
//     status: "active",
//     balance: 90,
//     currency: "BDT",
//     agentStatus: "approved",
//   },
//   {
//     profile_image: "https://example.com/images/9.jpg",
//     name: "Sadia Islam",
//     email: "sadia.islam@example.com",
//     password: "$2b$10$X2tX1VgRmcNzZzQ6fL2znOWi0F56Lc6OC2pbCk5cHr665Y1gm9bxy",
//     authProviders: [
//       { provider: "credential", providerId: "sadia.islam@example.com" },
//     ],
//     role: [TUserRole.USER],
//     status: "pending",
//     balance: 60,
//     currency: "BDT",
//     agentStatus: "requested",
//   },
//   {
//     profile_image: "https://example.com/images/10.jpg",
//     name: "Akash",
//     email: "akash@gmail.com",
//     password: "$2b$10$X2tX1VgRmcNzZzQ6fL2znOWi0F56Lc6OC2pbCk5cHr665Y1gm9bxy",
//     authProviders: [
//       { provider: "google", providerId: "mahmudul.hasan@example.com" },
//     ],
//     role: [TUserRole.USER, TUserRole.ADMIN],
//     status: "active",
//     balance: 150,
//     currency: "BDT",
//     agentStatus: "approved",
//   },
//   {
//     profile_image: "https://example.com/images/10.jpg",
//     name: "Mahmudul Hasan",
//     email: "mahmudul.hasan@example.com",
//     password: "$2b$10$X2tX1VgRmcNzZzQ6fL2znOWi0F56Lc6OC2pbCk5cHr665Y1gm9bxy",
//     authProviders: [
//       { provider: "google", providerId: "mahmudul.hasan@example.com" },
//     ],
//     role: [TUserRole.USER],
//     status: "active",
//     balance: 150,
//     currency: "BDT",
//     agentStatus: "approved",
//   },
// ];




export const seed = async () => {
  //todo: super admin seeding
 


  await Transaction.insertMany(transactionsData);
  console.log("✅ inserted successfully! transactions");
};





export const createSuperAdmin = async () => {

   const superAdmin: TUser = {
    name: "Super Admin",
    email: "super.admin@gmail.com",
    phone: "01300000000",
    avatar: "https://github.com/shadcn.png",
    password:"12345678",
    authProviders: [
      { provider: "credential", providerId: "super.admin@gmail.com" },
    ],
    role: TUserRole.ADMIN,
  };



  const existingSuperAdmin = await User.findOne({ email: superAdmin.email });
  if (existingSuperAdmin) {
    console.log(`😎 Super Admin has already been created.    ${superAdmin.email}:${superAdmin.password}`);
    return;
  }
 

  const createUser=await User.create(superAdmin);
  const wallet = await Wallet.create({
              user: createUser._id,
              balance: 50000000000,
              status: "active"
          });

  const updatedUser = await User.findByIdAndUpdate(
    createUser._id,
    { wallet: wallet._id },
    { new: true }
  );
  
  console.log(`😎 Super Admin created successfully!  ${superAdmin.email}:${superAdmin.password} `);
  return;
};




export const createServiceCharge = async () => {
  const existingServiceCharge = await Charge.findOne({ slug: "service-charge" });
  if (existingServiceCharge) {
    console.log("Service Charge has already been created.");
    return;
  }

  const serviceCharge: TCharge = {
    slug: "service-charge",
    sendMoneyCost: 10, 
    withdrawalFeePercentage: 2
  };

  await Charge.create(serviceCharge);
  console.log("✅ Service Charge created successfully!");
  return;
};










export const createDummyUsers = async () => {
  const dummyUsers: TUser[] = [


    {
      name: "User Ten",
      email: "user10@gmail.com",
      phone: "01300000010",
      avatar: "https://github.com/shadcn.png",
      password: "12345678",
      authProviders: [{ provider: "credential", providerId: "user3@gmail.com" }],
      role: TUserRole.USER,
    },
        {
      name: "User Eleven",
      email: "user11@gmail.com",
      phone: "01300000011",
      avatar: "https://github.com/shadcn.png",
      password: "12345678",
      authProviders: [{ provider: "credential", providerId: "user1@gmail.com" }],
      role: TUserRole.USER,
    },
        {
      name: "User Twelve",
      email: "user12@gmail.com",
      phone: "01300000012",
      avatar: "https://github.com/shadcn.png",
      password: "12345678",
      authProviders: [{ provider: "credential", providerId: "user1@gmail.com" }],
      role: TUserRole.USER,
    },

    {
      name: "Agent Seven",
      email: "agent7@gmail.com",
      phone: "01400000007",
      avatar: "https://github.com/shadcn.png",
      password: "12345678",
      authProviders: [{ provider: "credential", providerId: "agent2@gmail.com" }],
      role: TUserRole.AGENT,
    },
    {
      name: "Agent Eight",
      email: "agent8@gmail.com",
      phone: "01400000008",
      avatar: "https://github.com/shadcn.png",
      password: "12345678",
      authProviders: [{ provider: "credential", providerId: "agent3@gmail.com" }],
      role: TUserRole.AGENT,
    },

  ];

  for (const u of dummyUsers) {
    const exists = await User.findOne({ email: u.email });
    if (exists) {
      console.log(`⚡ Already exists: ${u.email}`);
      continue;
    }

    const createdUser = await User.create(u);
    const wallet = await Wallet.create({
      user: createdUser._id,
      balance: 100000, 
      status: "blocked",
    });

    await User.findByIdAndUpdate(createdUser._id, { wallet: wallet._id });
    console.log(`✅ Created: ${u.role} -> ${u.email}:${u.password}`);
  }

  console.log("🎉 Dummy users created successfully!");
};




export const createDummyTransactions = async () => {
  const transactions = [
    {
      "id": "txn_011",
      "method": "send-money",
      "from": "01300000002",
      "fromUserID": "68f9a6679b81e0c610b4484d",
      "to": "01300000001",
      "toUserID": "68f9a6669b81e0c610b44845",
      "amount": 400,
      "date": "2025-07-10T09:20:00.000Z",
      "status": "completed"
    },
    {
      "id": "txn_012",
      "method": "cash-out",
      "from": "01300000003",
      "fromUserID": "68f9a6679b81e0c610b44856",
      "to": "01400000001",
      "toUserID": "68f9a6689b81e0c610b4485e",
      "amount": 800,
      "date": "2025-07-22T14:30:00.000Z",
      "status": "completed"
    },
    {
      "id": "txn_013",
      "method": "top-up",
      "from": "01300000001",
      "fromUserID": "68f9a6669b81e0c610b44845",
      "to": "SYSTEM",
      "toUserID": null,
      "amount": 200,
      "date": "2025-08-05T11:15:00.000Z",
      "status": "completed"
    },
    {
      "id": "txn_014",
      "method": "add-money",
      "from": "01400000002",
      "fromUserID": "68f9a6689b81e0c610b44866",
      "to": "01400000002",
      "toUserID": "68f9a6689b81e0c610b44866",
      "amount": 3000,
      "date": "2025-08-18T16:45:00.000Z",
      "status": "completed"
    },
    {
      "id": "txn_015",
      "method": "send-money",
      "from": "01300000001",
      "fromUserID": "68f9a6669b81e0c610b44845",
      "to": "01300000003",
      "toUserID": "68f9a6679b81e0c610b44856",
      "amount": 150,
      "date": "2025-09-03T10:00:00.000Z",
      "status": "failed"
    },
    {
      "id": "txn_016",
      "method": "cash-in",
      "from": "01400000001",
      "fromUserID": "68f9a6689b81e0c610b4485e",
      "to": "01300000002",
      "toUserID": "68f9a6679b81e0c610b4484d",
      "amount": 1000,
      "date": "2025-09-20T13:25:00.000Z",
      "status": "completed"
    },
    {
      "id": "txn_017",
      "method": "top-up",
      "from": "01300000002",
      "fromUserID": "68f9a6679b81e0c610b4484d",
      "to": "SYSTEM",
      "toUserID": null,
      "amount": 75,
      "date": "2025-10-12T08:40:00.000Z",
      "status": "completed"
    },
    {
      "id": "txn_018",
      "method": "send-money",
      "from": "01300000003",
      "fromUserID": "68f9a6679b81e0c610b44856",
      "to": "01300000002",
      "toUserID": "68f9a6679b81e0c610b4484d",
      "amount": 600,
      "date": "2025-11-05T17:10:00.000Z",
      "status": "completed"
    },
    {
      "id": "txn_019",
      "method": "cash-out",
      "from": "01300000002",
      "fromUserID": "68f9a6679b81e0c610b4484d",
      "to": "01400000002",
      "toUserID": "68f9a6689b81e0c610b44866",
      "amount": 2000,
      "date": "2025-11-28T12:00:00.000Z",
      "status": "completed"
    },
    {
      "id": "txn_020",
      "method": "send-money",
      "from": "01300000001",
      "fromUserID": "68f9a6669b81e0c610b44845",
      "to": "01300000002",
      "toUserID": "68f9a6679b81e0c610b4484d",
      "amount": 900,
      "date": "2025-12-24T20:30:00.000Z",
      "status": "completed"
    }
  ];

  try {
    await Transaction.insertMany(transactions);
    console.log("🎉 10 more dummy transactions seeded successfully!");
  } catch (error) {
    console.error("❌ Error seeding additional transactions:", error);
  }
};