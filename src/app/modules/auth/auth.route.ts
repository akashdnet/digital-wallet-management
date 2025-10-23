import { NextFunction, Request, Response, Router } from "express";
import passport from "passport";
import { AuthControllers } from "./auth.controller";

const router = Router();

router.post(
  "/login", 
  AuthControllers.credentialsLogin);




  



router.post("/logout", AuthControllers.logout);








router.post("/refresh-token", AuthControllers.refreshToken)







export const AuthRoutes = router;
