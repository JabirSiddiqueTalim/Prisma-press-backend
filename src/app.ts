import express ,{ Application, request, Request, Response } from "express";

const app : Application = express();
import cors from 'cors';
import config from "./config";
import cookieParser from "cookie-parser";
import httpStatus from "http-status";
import { prisma } from "./lib/prisma";
import bcrypt from "bcryptjs";
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

app.post("/api/users/register",async(req:Request,res:Response)=>{
    const {name,email,password,profilePhoto}=req.body;
    // console.log(payload);
    const isUserExist=await prisma.user.findUnique({
        where:{email}
    })
    if(isUserExist)
    {
        throw new Error("User with this email already exists");
    }
    const hashPassword=await bcrypt.hash(password,Number(config.bcrypt_salt_rounds))

    const createUser=await prisma.user.create({
      data:
      {
        name,
        email,
        password:hashPassword,
      }
    })
    
    await prisma.profile.create({
        data:
        {
            userId:createUser.id,
            profilePhoto
        }
    })

    const user=await prisma.user.findUnique({
        where :
        {
            id:createUser.id,
            email:createUser.email || email
        },
        omit:{
            password:true
        },
        include:{
            profileId:true
        },
    })



    res.status(httpStatus.CREATED).json({
        success:true,
        statusCode:httpStatus.CREATED,
        message:"User registered successfully",
        data:{
            user
        }

    })
})

export default app;