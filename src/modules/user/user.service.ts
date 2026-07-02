import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import { RegisterUserPayload } from "./user.interface";
import config from "../../config";
import httpStatus from "http-status";
const registerUserIntoDB=async(payload:RegisterUserPayload)=>
{
  const {name,email,password,profilePhoto}=payload;
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
        profile:true
    }, 
})
 return user;
}

const getMyProfileIntoDB=async(userId:string)=>{
  const user=await prisma.user.findFirstOrThrow({
    where:{id:userId},
    omit:{
      password:true
    },
    include:{
      profile:true

    }
    
  })
  return user;
}
const updateMyProfileInDB = async (userId : string, payload : any) => {
  const {name, email, profilePhoto, bio} = payload;

  const updatedUser = await prisma.user.update({
      where : { id : userId},

      data : {
          name,
          email,
          profile : {
              update : {
                  profilePhoto,
                  bio
              }
          }
      },

      omit : {
          password : true
      },

      include : {
          profile : true
      }
  })

  return updatedUser;
}


export const UserService={
  registerUserIntoDB,
  getMyProfileIntoDB,
  updateMyProfileInDB
}