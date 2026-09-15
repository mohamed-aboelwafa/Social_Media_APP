
import { NextFunction, Request, Response } from "express";

import { BadRequestException, UnAuthorizedException } from "../../utils/error.exceptions";
import { verifytoken } from "../../utils/security/token";
import UserModel from "../user/models/user.model";
import { jwtIdKey } from "../../utils/redis/redis.services";
import { redisClient } from "../../DB/redis.connection";
import { HUser, IUser } from "../user/types/user.types";

export enum TokenEnum{
    access,
    refresh
}

declare module "express-serve-static-core"{
    interface Request{
        user:HUser
    }
}

export const auth= async(req: Request, res: Response, next:NextFunction)=>{
    const {authorization} = req.headers
    const {user} = await decodedToken({authorization: authorization as string, tokenType: TokenEnum.access})
    
    req.user = user
    next()
}

export const decodedToken = async ({authorization, tokenType = TokenEnum.access}:{authorization: string, tokenType?:TokenEnum})=>{
    if(!authorization){
        throw new UnAuthorizedException();
    }
    if(!authorization.startsWith("Bearer ")){
        throw new BadRequestException("invalid auth method")
    }

    const token: string = authorization.split(" ")[1] as string
    if(!token){
        throw new UnAuthorizedException();
    }

    const payload= verifytoken(token, tokenType == TokenEnum.access ? process.env.ACCESS_JWT_SECRET as string : process.env.REFRESH_JWT_SECRET as string) as {
        _id: string,
        iat: number,
        exp: number,
        jti: string
    }

    const user = await UserModel.findById(payload._id)
    if(!user){
        throw new UnAuthorizedException();
    }
    if(!user.confirmedAt){
        throw new UnAuthorizedException();
    }

    const sessionKey = jwtIdKey(user.id, payload.jti)
    const session = await redisClient.get(sessionKey)
    if(!session){
        throw new UnAuthorizedException();
    }

    return {user}

}