import express from "express";
import { TransactionControllers } from "./transaction.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { TUserRole } from "../user/user.interface";

const router = express.Router();

router.get(
  "/all-transactions",
  checkAuth(TUserRole.ADMIN),
  TransactionControllers.fetchAllTransactions
);

router.get(
  "/my-transactions",
  checkAuth(TUserRole.USER),
  TransactionControllers.fetchMyAllTransactions
);


router.get(
  "/test",
  TransactionControllers.test
);



router.get(
  "/:id",
  checkAuth(TUserRole.ADMIN, TUserRole.USER),
  TransactionControllers.getUserTransaction
);


export const TransactionRoutes = router;
