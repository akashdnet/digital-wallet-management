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

router.post(
  "/status",
  checkAuth(TUserRole.ADMIN),
  WalletControllers.walletStatus
);

router.post(
  "/send-money",
  checkAuth(TUserRole.USER),
  WalletControllers.sendMoney
);

router.post(
  "/top-up",
  checkAuth(TUserRole.USER),
  WalletControllers.topUp
);

router.post(
  "/cash-in",
  checkAuth(TUserRole.AGENT),
  WalletControllers.cashIn
);


router.post(
  "/cash-out",
  checkAuth(TUserRole.USER),
  WalletControllers.cashOut
);

export const WalletRoutes = router;
