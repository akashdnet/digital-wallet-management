import express from "express";
import { UserControllers } from "./user.controller";
import { validateRequest } from "../../utils/validationRequest";
import { UserValidation } from "./user.validation";
import { checkAuth } from "../../middlewares/checkAuth";
import { TUserRole } from "./user.interface";
import { upload } from "../../middlewares/upload";

const router = express.Router();

// create 
router.post(
  "/create",
  upload.single("file"),
  validateRequest(UserValidation.create),
  UserControllers.create
);


  // view 
  router.get("/me", 
  checkAuth(TUserRole.ADMIN, TUserRole.AGENT, TUserRole.USER),
  UserControllers.me
);
  
  
  
  // update 
  router.patch(
    "/me",
  checkAuth(TUserRole.ADMIN, TUserRole.USER, TUserRole.AGENT),
  upload.single("file"),
  validateRequest(UserValidation.update),
  UserControllers.update
);





  router.patch(
    "/change-password",
  checkAuth(TUserRole.ADMIN, TUserRole.USER, TUserRole.AGENT),
  validateRequest(UserValidation.changePassword),
  UserControllers.changePassword,
);
















export const UserRoutes = router;
