import express from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { validateRequest } from "../../utils/validationRequest";
import { TUserRole } from "../user/user.interface";
import { ContactUsControllers } from "./contactus.controller";
import { ContactUsValidation } from "./contactus.validation";

const router = express.Router();

router.post(
    "/",
    validateRequest(ContactUsValidation.create),
    ContactUsControllers.create
);

router.get(
    "/",
    checkAuth(TUserRole.ADMIN),
    ContactUsControllers.getAll
);

export const ContactUsRoutes = router;
