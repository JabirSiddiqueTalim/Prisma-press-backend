import { NextFunction, Request, response, Response } from "express"
import { catchAsync } from "../utils/catchAsync"
import { authService } from "./auth.service";
import { sendResponse } from "../utils/sendResponse";
import httpStatus from "http-status";
const loginController=catchAsync(async(req:Request,res:Response,next:NextFunction)=>{
  const payload=req.body;
  const user=await authService.loginService(payload);

  sendResponse(res,{
    success:true,
    statusCode:httpStatus.CREATED,
    message:"User Login Successfully",
    data:{user}
  })
})
export const authController={
  loginController
}