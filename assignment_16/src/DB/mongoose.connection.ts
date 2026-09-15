
import mongoose from "mongoose";

export const DBConnection = async()=>{
    mongoose.connect(process.env.LOCAL_DB_URI as string)
        .then(()=>{
            console.log("DB connected successfully");
        }).catch(console.log)
};