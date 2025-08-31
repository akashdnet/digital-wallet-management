import { Router } from "express";
import { TestControllers } from "./test.controller";


const router = Router();


router.get(
  "/posts", 
  TestControllers.getAllPost);






export const TestRoutes = router;
