import express from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { upload } from "../../middlewares/upload";
import { validateRequest } from "../../utils/validationRequest";
import { UserControllers } from "./user.controller";
import { TUserRole } from "./user.interface";
import { UserValidation } from "./user.validation";

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


router.get("/overview",
  checkAuth(TUserRole.ADMIN, TUserRole.AGENT, TUserRole.USER),
  UserControllers.overview
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
