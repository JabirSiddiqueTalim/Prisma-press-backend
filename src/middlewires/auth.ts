import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../modules/utils/catchAsync";
import { jwtUtils } from "../modules/utils/jwt";
import config from "../config";
import { JwtPayload } from "jsonwebtoken";
import { prisma } from "../lib/prisma";

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
export const auth = (...requiredRole : any ) => {
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
        throw new Error("Your account has be blocked. Please contact with support team");
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
