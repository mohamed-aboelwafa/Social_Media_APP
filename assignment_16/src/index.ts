
import dotenv from "dotenv";
import {bootstrap} from "./bootstrap";
import * as z from "zod";

dotenv.config();
bootstrap();

export const signup = async (data:any)=>{
    const schema = z.number()
    // const schema = z.enum(["a","b"])
    const validationRes = await schema.safeParseAsync(data)
    if(!validationRes.success){
        console.log(validationRes.error.issues);
    }
}

//signup("MOHAMED");