
import { BadRequestException } from "../../utils/error.exceptions";
import {loginDTOBody , loginDTOQuery} from "./auth.validation";

export const loginService = (body: loginDTOBody, query: loginDTOQuery)=>{
    // body.
    // query.
    
    // throw new BadRequestException("bad request");

    return{
        data:{body,query}
    }
}