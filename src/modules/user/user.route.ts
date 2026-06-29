import { Request, Response, Router } from "express";
import { Prisma } from "../../../generated/prisma/browser";
import bcrypt from "bcryptjs";
import config from "../../config";
import { prisma } from "../../lib/prisma";
import httpStatus from "http-status";
import { UserController } from "./user.controller";
const router =Router()

router.post("/register",UserController.registerController)

export const userRouter=router;