import express,{Request,Response,NextFunction} from "express";
import chalk from "chalk";
import morgan from "morgan";
import { DBConnection } from "./DB/mongoose.connection";
import { NotFoundException , IError } from "./utils/error.exceptions";
// import { ErrorRequestHandler } from "express";
import * as z from "zod";
import authRouter from "./modules/auth/auth.controller";
import { redisClient } from "./DB/redis.connection";
import userRouter ,{ routes as userRoutes } from "./modules/user/user.controller";
import UserModel from "./modules/user/models/user.model";
import { GenderEnum, HUser } from "./modules/user/types/user.types";
import {Server} from "socket.io";
import { Socket } from "socket.io";
import cors from "cors";
import postRouter,{ routes as postRoutes } from "./modules/post/post.controller";
import commentRouter,{routes as commentRoutes} from "./modules/comment/comment.controller";
import { decodedToken } from "./modules/auth/auth.middleware";
import { initializeIo } from "./modules/gateway/gateway";
import chatRouter, {routes as chatRoutes} from "./modules/auth/auth.controller";


const app = express();
export const bootstrap = async ()=> {
    app.use(cors());
    app.use(express.json());
    app.use(morgan("dev"));
    await DBConnection();
    await redisClient.connect();
    app.use(chatRoutes.base, chatRouter)
    app.use(userRoutes.base, userRouter)
    app.use("/auth",authRouter);
    app.use(postRoutes.base,postRouter)
    app.use(commentRoutes.base, commentRouter)

    // localhost:3000/hello
    app.get('/hello',(req,res)=>{
        res.json({
            msg:"welcome to bootstrap.js file"
        })

        // throw new NotFoundException("test not foundd");
    })

    app.use((err: IError, req: Request, res:Response, next: NextFunction)=>{
        res.status(err.statusCode).json({
            errMessage: err.message,
            validationError: err.validationError,
            status: err.statusCode,
            stack: err.stack
        })
    })

    // const testHook = async()=>{
    //     // const user = await UserModel.create({
    //     //     bio: "test hook",
    //     //     email: `${Date.now()}gmail.com`,
    //     //     gender: GenderEnum.male,
    //     //     name: "test hook",
    //     //     password: "123",
    //     //     phone: "0123713839",
    //     //     age: 23
    //     // })
    //     // // const user = await UserModel.findById("6a89818cf4942bb087eca51b") as HUser
    //     // // user.password = "afjaj;lja;lvc"
    //     // // await user.save()
    //     // console.log({user});
    //     const user = await UserModel.findOne({email: "mohameddotmail1630@gmail.com"}); // 
    //     console.log({user});
    // }
    // testHook()

    const httpServer = app.listen(process.env.PORT,()=>{
        console.log(chalk.bgGreen.blue("server is running on port",process.env.PORT));
    })

    initializeIo(httpServer);




}
