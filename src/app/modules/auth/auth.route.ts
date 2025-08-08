import { NextFunction, Request, Response, Router } from "express";
import passport from "passport";
import { AuthControllers } from "./auth.controller";

const router = Router();

router.post("/login", AuthControllers.credentialsLogin);
router.get("/google", AuthControllers.google);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  AuthControllers.googleCallbackController
);




// router.post(
//   "/reset-password",
//   checkAuth(...Object.values(Role)),
//   AuthControllers.resetPassword
// );













router.post("/logout", AuthControllers.logout);





export const AuthRoutes = router;
