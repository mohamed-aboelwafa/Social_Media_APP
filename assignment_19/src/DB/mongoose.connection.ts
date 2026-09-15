
import mongoose from "mongoose";

export const DBConnection = async()=>{
    try{
        await mongoose.connect(process.env.LOCAL_DB_URI as string)
        console.log("DB connected successfully");
    }catch(error){
        console.log("DB connection faileed",error);
        throw error;
    }
};