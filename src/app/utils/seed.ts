import { TCharge } from "../modules/charge/charge.interface";
import { Charge } from "../modules/charge/charge.model";
import { TUser, TUserRole } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";
import { Wallet } from "../modules/wallet/wallet.model";

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




// export const seed = async () => {
//   //todo: super admin seeding
 


//   // await User.insertMany(users);
//   console.log("✅ 11 users inserted successfully!");
// };





export const createSuperAdmin = async () => {
  const existingSuperAdmin = await User.findOne({ email: "super.admin@gmail.com" });
  if (existingSuperAdmin) {
    console.log("Super Admin has already been created.");
    return;
  }
  const superAdmin: TUser = {
    name: "Super Admin",
    email: "super.admin@gmail.com",
    password:"$2b$10$X2tX1VgRmcNzZzQ6fL2znOWi0F56Lc6OC2pbCk5cHr665Y1gm9bxy",
    authProviders: [
      { provider: "credential", providerId: "super.admin@gmail.com" },
    ],
    role: [TUserRole.USER, TUserRole.ADMIN],
  };

  const createUser=await User.create(superAdmin);
  const wallet = await Wallet.create({
              user: createUser._id,
              balance: 50000000000,
              status: "active"
          });
  console.log("✅ Super Admin created successfully!");
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
