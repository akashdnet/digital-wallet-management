import express from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { TUserRole } from "../user/user.interface";
import { ChargeControllers } from "./charge.controller";

const router = express.Router();

router.get(
  "/",
  checkAuth(TUserRole.ADMIN, TUserRole.USER, TUserRole.AGENT),
  ChargeControllers.getCharge
);

router.patch(
  "/",
  checkAuth(TUserRole.ADMIN),
  ChargeControllers.updateCharge
);

export const ChargeRoutes = router;
