
import jwt from "jsonwebtoken"

export const generateToken = (paload:string|object , secretkey:jwt.Secret , options:jwt.SignOptions = {})=>{
    const token = jwt.sign(paload, secretkey , options)
    return token
}

export const verifytoken = (token:string, secretkey:jwt.Secret, options:jwt.VerifyOptions={})=>{
    const payload = jwt.verify(token, secretkey, options)
    return payload
}