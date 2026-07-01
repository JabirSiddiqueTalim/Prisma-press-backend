import { NextFunction, Request, Response, Router } from "express";
import { Prisma, Role } from "../../../generated/prisma/browser";
import bcrypt from "bcryptjs";
import config from "../../config";
import { prisma } from "../../lib/prisma";
import httpStatus from "http-status";
import { UserController } from "./user.controller";
import { jwtUtils } from "../utils/jwt";
const router =Router()
declare global{
  namespace Express{
    interface Request{
      user?:{
        email:string;
        name:string;
        id:string;
        role:string;
      }
    }
  }
}

router.post("/register",UserController.registerController)
router.get("/me",(req:Request,res:Response,next:NextFunction)=>{
  const {accessToken}=req.cookies;
  console.log(accessToken)
  const varifiedToken= jwtUtils.varifiedToken(accessToken,config.jwt_access_secret)
 
  if(typeof varifiedToken === "string")
  {
    throw new Error(varifiedToken);
  }
 const {email,name,id,role}=varifiedToken;
 const requiredRoles=[Role.ADMIN,Role.AUTHOR,Role.USER];
 if(!requiredRoles.includes(role))
 {
  return res.status(403).json({
    success:false,
    statusCode:httpStatus.FORBIDDEN,
    message:"Forbidden . you don't have permission to access this resource"
  })
 }
 req.user={
  email,
  name,
  id,
  role
 }
next()

},UserController.getMyProfile)
export const userRouter=router;