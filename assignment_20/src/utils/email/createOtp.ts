import { customAlphabet } from "nanoid";

// export const createOtp = ()=>{
//     return Math.floor(100000+Math.random()*900000);
// }

export const createOtp = customAlphabet("0123456789",6)