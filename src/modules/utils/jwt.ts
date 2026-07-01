import jwt,{ JwtPayload, SignOptions } from "jsonwebtoken"

const createToken=(payload:JwtPayload,secret:string,expiresIn:SignOptions)=>{
  const jwtToken=jwt.sign(payload,secret,{expiresIn}as SignOptions)
  return jwtToken;
}
export const jwtUtils={
  createToken
} 