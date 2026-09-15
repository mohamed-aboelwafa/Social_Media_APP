import type {Request , Response , NextFunction} from 'express';
import * as z from 'zod';
import { ValidationException } from '../utils/error.exceptions';
import { $ZodIssue } from 'zod/v4/core';

export type schemaType = Partial<Record<keyof Request, z.ZodObject>>

export const validation = (schema: schemaType)=>{
    return async (req:Request, res:Response, next:NextFunction )=>{
        const keys = Object.keys(schema) as (keyof Request)[]

        const validationErrors: z.core.$ZodIssue[] = []
        for(const key of keys){
            console.log({key});

            const validationRes = await schema[key]?.safeParseAsync(req[key])
            if(validationRes?.success==false){
                console.log(validationRes.error.issues);
                
                // validationErrors.push(validationRes?.error.issues as unknown as z.core.$ZodIssue)
                validationErrors.push(...validationRes.error.issues);
            }
        }
        console.log({validationErrors});

        if(validationErrors.length){
            throw new ValidationException(validationErrors)
        }else{
            return next()
        }
    }
}
