import express from "express";
import { WalletControllers } from "./wallet.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { TUserRole } from "../user/user.interface";
import { validateRequest } from "../../utils/validationRequest";
import { WalletValidation } from "./wallet.validation";

const router = express.Router();







router.patch(
  "/send-money",
  checkAuth(TUserRole.USER),
  validateRequest(WalletValidation.sendMoney),
  WalletControllers.sendMoney
);



router.patch(
  "/cash-out",
  checkAuth(TUserRole.USER),
  validateRequest(WalletValidation.cashOut),
  WalletControllers.cashOut
);


router.patch(
  "/cash-in",
  checkAuth(TUserRole.AGENT),
  validateRequest(WalletValidation.cashIn),
  WalletControllers.cashIn
);





router.patch(
  "/top-up",
  checkAuth(TUserRole.USER, TUserRole.AGENT, TUserRole.ADMIN),
  validateRequest(WalletValidation.topUp),
  WalletControllers.topUp
);






export const WalletRoutes = router;
