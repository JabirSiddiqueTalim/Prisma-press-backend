import { NextFunction, Request, Response, Router } from "express";
import { Prisma, Role } from "../../../generated/prisma/browser";
import bcrypt from "bcryptjs";
import config from "../../config";
import { prisma } from "../../lib/prisma";
import httpStatus from "http-status";
import { UserController } from "./user.controller";
import { jwtUtils } from "../utils/jwt";
import { catchAsync } from "../utils/catchAsync";
import { JwtPayload } from "jsonwebtoken";
import { auth } from "../../middlewires/auth";
const router =Router()

router.post("/register",UserController.registerController)
router.get("/me",
//   (req:Request,res:Response,next:NextFunction)=>{
//   const {accessToken}=req.cookies;
//   console.log(accessToken)
//   const varifiedToken= jwtUtils.varifiedToken(accessToken,config.jwt_access_secret)
 
//   if(typeof varifiedToken === "string")
//   {
//     throw new Error(varifiedToken);
//   }
//  const {email,name,id,role}=varifiedToken.data as JwtPayload;
//  const requiredRoles=[Role.ADMIN,Role.AUTHOR,Role.USER];
//  if(!requiredRoles.includes(role))
//  {
//   return res.status(403).json({
//     success:false,
//     statusCode:httpStatus.FORBIDDEN,
//     message:"Forbidden . you don't have permission to access this resource"
//   })
//  }
//  req.user={
//   email,
//   name,
//   id,
//   role
//  }
// next()

// },
auth(Role.ADMIN,Role.AUTHOR,Role.USER),
UserController.getMyProfile)

router.put("/my-profile", auth(Role.ADMIN, Role.USER, Role.AUTHOR), UserController.updateMyProfile);

export const userRouter=router;