import { Response } from "express";

export const successRes = ({res, data={}, statusCode=200, message=true}:{res: Response, data?: string | object, statusCode?:number, message?:string | boolean})=>{
    return res.status(statusCode).json({
        message,
        data,
        statusCode,
        timestamp: new Date()
    })
}