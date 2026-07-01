import jwt,{ JwtPayload, SignOptions } from "jsonwebtoken"

const createToken=(payload:JwtPayload,secret:string,expiresIn:SignOptions)=>{
  const jwtToken=jwt.sign(payload,secret,{expiresIn}as SignOptions)
  return jwtToken;
}
const  varifiedToken = (token : string, secret : string) => {
  try {
       const varifiedToken = jwt.verify(token, secret);
       return {
           success: true,
           data: varifiedToken
       };
  } catch (error : any) {
       console.log("Token verification failed:", error);
       return {
           success: false,
           error : error.message
       }
  }
}

export const jwtUtils={
  createToken,
  varifiedToken
} 