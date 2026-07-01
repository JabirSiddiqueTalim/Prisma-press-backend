import { NextFunction, Request, RequestHandler, Response } from "express";
import { prisma } from "../../lib/prisma";
import bcrypt from "bcryptjs";
import httpStatus from "http-status";
import config from "../../config";
import { UserService } from "./user.service";
import { catchAsync } from "../utils/catchAsync";
import { sendResponse } from "../utils/sendResponse";
import  jwt  from "jsonwebtoken";
import { jwtUtils } from "../utils/jwt";
import strict from "assert/strict";
import { error } from "console";

const registerController=catchAsync(async(req:Request,res:Response,next:NextFunction)=>{
  const payload=req.body;
  const user=await UserService.registerUserIntoDB(payload);

  sendResponse(res,{
    success:true,
        statusCode:httpStatus.CREATED,
        message:"User registered successfully",
        data:{user}
  })
})
const getMyProfile=catchAsync(async(req:Request,res:Response,next:NextFunction)=>{
  
  const {accessToken}=req.cookies;
  console.log(accessToken);
  const varifiedToken= jwtUtils.varifiedToken(accessToken,config.jwt_access_secret)
  console.log(varifiedToken);
  if(typeof varifiedToken === "string")
  {
    throw new Error(varifiedToken);

  }
  const profile=await UserService.getMyProfileIntoDB(varifiedToken.id)
  
  sendResponse(res,{
    success: true,
    statusCode:httpStatus.OK,
    message: "User profile fetched successfully",
    data: {profile}
  })
  
  res.send("Get my profile")
})


export const UserController={
  registerController,
  getMyProfile
}