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
const auth = (...requiredRole : UserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.accessToken ? req.cookies.accessToken 
    : req.headers.authorization?.startsWith("Bearer") ? req.headers.authorization.split(" ")[1] : 
    req.headers.authorization

    if (!token) {
      throw new Error("You are not logged in");
    }

    const verifyToken = jwtUtils.varifiedToken(token, config.jwt_access_secret);

    if (!verifyToken.success) {
      throw new Error( verifyToken.error);
    }
    const { id, name, email, role } = verifyToken.data as JwtPayload;
    console.log(role)

    if (!requiredRole.includes(role)) {
        throw new Error("You are not authorized to access this route");
    }

    const user = await prisma.user.findUnique({
        where: {
            id,
            email,
            role,
            name
        }
    })

    if (!user) {
        throw new Error("User not found");
    }

    if (user.activeStatus === "BLOCKED") {
        throw new Error("Your account has beem blocked. Please contact with support team");
    }

    req.user = {
      id,
      name,
      email,
      role,
    };

    next();

  });
};

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
export const userRouter=router;