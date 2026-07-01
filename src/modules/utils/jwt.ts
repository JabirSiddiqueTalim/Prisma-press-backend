import jwt,{ JwtPayload, SignOptions } from "jsonwebtoken"

const createToken=(payload:JwtPayload,secret:string,expiresIn:SignOptions)=>{
  const jwtToken=jwt.sign(payload,secret,{expiresIn}as SignOptions)
  return jwtToken;
}
const varifiedToken=(accessToken:string,secret:string)=>{
  const varifiedToken=jwt.verify(accessToken,secret);
  return varifiedToken;
}
export const jwtUtils={
  createToken,
  varifiedToken
} 