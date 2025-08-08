import express from "express";
import { WalletControllers } from "./wallet.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { TUserRole } from "../user/user.interface";

const router = express.Router();

router.get(
  "/:id",
  checkAuth(TUserRole.USER, TUserRole.ADMIN),
  WalletControllers.getWalletByUserId
);

router.patch(
  "/status",
  checkAuth(TUserRole.ADMIN),
  WalletControllers.walletStatus
);

router.patch(
  "/send-money",
  checkAuth(TUserRole.USER),
  WalletControllers.sendMoney
);

router.patch(
  "/top-up",
  checkAuth(TUserRole.USER),
  WalletControllers.topUp
);

router.patch(
  "/cash-in",
  checkAuth(TUserRole.AGENT),
  WalletControllers.cashIn
);


router.patch(
  "/cash-out",
  checkAuth(TUserRole.USER),
  WalletControllers.cashOut
);

export const WalletRoutes = router;
