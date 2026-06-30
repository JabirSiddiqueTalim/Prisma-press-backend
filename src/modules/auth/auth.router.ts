import { Router } from "express";
import { authController } from "./auth.controller";
import app from "../../app";

const router=Router();

router.post("/login",authController.loginController);

export const authRouter=router;