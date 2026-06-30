import express ,{ Application, request, Request, Response } from "express";

const app : Application = express();
import cors from 'cors';
import config from "./config";
import cookieParser from "cookie-parser";
import httpStatus from "http-status";
import { prisma } from "./lib/prisma";
import bcrypt from "bcryptjs";
import { userRouter } from "./modules/user/user.route";
import { authRouter } from "./modules/auth/auth.router";
app.use(cors({
    origin: config.app_url,
    credentials:true,
}))

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());




app.get("/",(req:Request,res:Response)=>{
   res.send("Hello World");
})

app.use("/api/users",userRouter);
app.use("/api/auth",authRouter);

export default app;