import { NextFunction, Request, RequestHandler, Response } from "express";
import { prisma } from "../../lib/prisma";
import bcrypt from "bcryptjs";
import httpStatus from "http-status";
import config from "../../config";
import { UserService } from "./user.service";
import { catchAsync } from "../utils/catchAsync";
import { sendResponse } from "../utils/sendResponse";


const registerController=catchAsync(async(req:Request,res:Response,next:NextFunction)=>{
  const payload=req.body;
  const user=await UserService.registerUserIntoDB(payload);
  // res.status(httpStatus.CREATED).json({
  //     success:true,
  //     statusCode:httpStatus.CREATED,
  //     message:"User registered successfully",
  //     data:{
  //         user
  //     }

  // })
  sendResponse(res,{
    success:true,
        statusCode:httpStatus.CREATED,
        message:"User registered successfully",
        data:{user}
  })
})
export const UserController={
  registerController
}