import express from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { TUserRole } from "../user/user.interface";
import { AdminControllers } from "./admin.controller";
import { validateRequest } from "../../utils/validationRequest";
import { adminValidationSchema } from "./admin.validation";

const router = express.Router();

router.get(
  "/dashboard-overview",
  checkAuth( TUserRole.ADMIN),
  AdminControllers.dashboardOverview
);
// updateUserProfileByAdminValidationSchema
router.post(
  "/update-user-profile",
  checkAuth( TUserRole.ADMIN),
  validateRequest(adminValidationSchema.updateUserProfile),
  AdminControllers.updateUserProfile
);

router.delete(
  "/delete-user/:id",
  checkAuth( TUserRole.ADMIN),
  AdminControllers.deleteUser
);



export const AdminRoutes = router;
