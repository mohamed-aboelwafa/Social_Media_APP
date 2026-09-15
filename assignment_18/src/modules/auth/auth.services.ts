import { redisClient } from "../../DB/redis.connection";
import { createOtp } from "../../utils/email/createOtp";
import { sendEmail } from "../../utils/email/sendEmail";
import { generateHtml } from "../../utils/email/template";
import { BadRequestException, NotFoundException } from "../../utils/error.exceptions";
import { confirmEmailKey , jwtIdKey} from "../../utils/redis/redis.services";
import UserModel from "../user/models/user.model";
import { confirmEmailData, resendConfirmEmailData , loginData, signupData } from "./auth.validation";
// import {loginDTOBody} from "./auth.validation";
import { hash,compare } from "../../utils/security/hash";
import { randomUUID } from "node:crypto";
import { generateToken } from "../../utils/security/token";
// import th from "zod/v4/locales/th.js";
import { nanoid } from "nanoid";

class AuthServices{
    async signup(data:signupData){
        const {bio,email,gender,name,password,phone,age} = data
        const isEmailExist = await UserModel.findOne({email});
        if(isEmailExist){
            throw new BadRequestException("email already exist");
        }
        const user = await UserModel.create({
            bio, 
            email, 
            gender, 
            name, 
            password, 
            phone, 
            age: age as number
        })

        return {
            data:{user}
        }
    }

    async confirmEmail({email, otp}: confirmEmailData){
        const user = await UserModel.findOne({
            email, confirmedAt:{
                $exists: false
            }
        })
        if(!user){
            throw new BadRequestException("user not found")
        }
        const userOtp = await redisClient.get(confirmEmailKey(user.id))
        if(!userOtp){
            throw new BadRequestException("otp expired")
        }
        if(userOtp != otp){
            throw new BadRequestException("invalid otp")
        }
        user.confirmedAt = new Date()
        await redisClient.del(confirmEmailKey(user.id))
        await user.save()
        return {
            data: {}
        }
    }

    async login({email,password}:loginData){
        const isEmailExist = await UserModel.findOne({email})
        if(!isEmailExist){
            throw new BadRequestException("in credentials")
        }
        if(!isEmailExist.confirmedAt){
            throw new BadRequestException("please confirm your account first")
        }
        if(!await compare(password, isEmailExist.password)){
            throw new BadRequestException("in credentials")
        }
        const jwtid = nanoid(20)
        // const jwtid = randomUUID();
        const accessToken = generateToken(
            {
                _id: isEmailExist._id
            },
                process.env.ACCESS_JWT_SECRET as string,
            {
                expiresIn: "30M",
                jwtid
            }
        )
        const refreshToken = generateToken(
            {
                _id: isEmailExist._id
            },
                process.env.REFRESH_JWT_SECRET as string,
            {
                expiresIn: "7D",
                jwtid
            }
        )
        await redisClient.set(jwtIdKey(isEmailExist.id, jwtid), jwtid)

        return {data:{
            accessToken,
            refreshToken
        }}
    }

    async resentOtp({email}:resendConfirmEmailData){
        const user = await UserModel.findOne({email})
        if(!user){
            throw new NotFoundException('user not found')
        }
        if(user?.confirmedAt){
            throw new BadRequestException("you are already confirmed")
        }

        const key = confirmEmailKey(user.id)
        const oldOtp = await redisClient.get(key)
        if(oldOtp){
            const ttl = await redisClient.ttl(key)
            throw new BadRequestException(`wait ${Math.ceil(ttl / 60)} minutes to resend otp`)
        }

        const otp = createOtp();
        await sendEmail({to:email,subject:'resend confirm email otp',html:generateHtml(otp)})
        await redisClient.set(confirmEmailKey(user.id),otp,{
            expiration:{
                type:"EX",
                value: 5*60
            }
        })

        return {
            data:{}
        }
    }
}

export const authServices = new AuthServices()



