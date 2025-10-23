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
  validateRequest(UserValidation.createUserValidationSchema),
  UserControllers.createUser
);


  // user profile 
  router.get("/me", 
  checkAuth(TUserRole.ADMIN, TUserRole.AGENT, TUserRole.USER),
  UserControllers.myProfile);
  
  
  
  // update profile 
  router.post(
    "/me",
  checkAuth(TUserRole.ADMIN, TUserRole.USER, TUserRole.AGENT),
  upload.single("file"),
  validateRequest(UserValidation.updateMyProfileValidationSchema),
  UserControllers.updateMyProfile
);





// all user 
router.get("/all-users", 
  checkAuth(TUserRole.ADMIN), 
  UserControllers.getAllUsers);






// single user 
router.get("/:id", 
  checkAuth(TUserRole.ADMIN, TUserRole.USER),
  UserControllers.getSingleUser);





// update user 
router.patch(
  "/:id",
  checkAuth(TUserRole.ADMIN),
  validateRequest(UserValidation.updateUserValidationSchema),
  UserControllers.updateUser
);







// delete 
router.delete("/:id", 
  checkAuth(TUserRole.ADMIN, TUserRole.USER),
 UserControllers.deleteUser);

export const UserRoutes = router;
