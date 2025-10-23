import express from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { TUserRole } from "../user/user.interface";
import { AdminControllers } from "./admin.controller";
import { validateRequest } from "../../utils/validationRequest";
import { adminValidationSchema } from "./admin.validation";

const router = express.Router();


// done 
router.get(
  "/dashboard-overview",
  checkAuth( TUserRole.ADMIN),
  AdminControllers.dashboardOverview
);



// done 
router.get(
  "/all-transactions",
  checkAuth( TUserRole.ADMIN),
  AdminControllers.fetchAllTransactions
);


// done 
router.patch(
  "/update-wallet-status/:userId",
  checkAuth( TUserRole.ADMIN),
  AdminControllers.updateWalletStatus  
);





// done 
router.patch(
  "/update-user-profile/:userId",
  validateRequest(adminValidationSchema.updateUserProfile),
  checkAuth( TUserRole.ADMIN),
  AdminControllers.updateUserProfile  
);
















// done 
router.delete(
  "/delete-user/:userID",
  checkAuth( TUserRole.ADMIN),
  AdminControllers.deleteUser
);




// done 
router.get(
  "/pending-users",
  checkAuth( TUserRole.ADMIN),
  AdminControllers.pendingUsers
);


// done 
router.get(
  "/pending-agents",
  checkAuth( TUserRole.ADMIN),
  AdminControllers.pendingAgents
);



// done 
router.get(
  "/user-list",
  checkAuth( TUserRole.ADMIN),
  AdminControllers.userList
);


// done 
router.get(
  "/agent-list",
  checkAuth( TUserRole.ADMIN),
  AdminControllers.agentList
);


export const AdminRoutes = router;
