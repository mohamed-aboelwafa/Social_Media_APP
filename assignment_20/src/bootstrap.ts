// import { ErrorRequestHandler } from "express";
// import * as z from "zod";
// import UserModel from "./modules/user/models/user.model";
// import { GenderEnum, HUser } from "./modules/user/types/user.types";
// import {Server} from "socket.io";
// import { Socket } from "socket.io";
// import { decodedToken } from "./modules/auth/auth.middleware";


import express,{Request, Response, NextFunction} from "express";
import chalk from "chalk";
import morgan from "morgan";
import { DBConnection } from "./DB/mongoose.connection";
import authRouter from "./modules/auth/auth.controller";
import { redisClient } from "./DB/redis.connection";
import userRouter ,{ routes as userRoutes } from "./modules/user/user.controller";
import cors from "cors";
import postRouter,{ routes as postRoutes } from "./modules/post/post.controller";
import commentRouter,{routes as commentRoutes} from "./modules/comment/comment.controller";
import { initializeIo } from "./modules/gateway/gateway";
import chatRouter, {routes as chatRoutes} from "./modules/auth/auth.controller";
import { GraphQLSchema, GraphQLObjectType, GraphQLString } from "graphql";
import { createHandler } from "graphql-http/lib/use/express";
import { IError } from "./utils/error.exceptions";
import schema from "./modules/graphql/graphql.schema";




const app = express();

export const bootstrap = async ()=> {

    app.use(cors());
    app.use(express.json());
    app.use(morgan("dev"));
    await DBConnection();
    await redisClient.connect();

    // REST routes
    app.use(chatRoutes.base, chatRouter)
    app.use(userRoutes.base, userRouter)
    app.use("/auth",authRouter);
    app.use(postRoutes.base,postRouter)
    app.use(commentRoutes.base, commentRouter)

    // GraphQL
    app.all('/graphql', createHandler({
        schema: schema
    }))


    // test schema
    const mySchema_1 = new GraphQLSchema({
        query: new GraphQLObjectType({
            name: "query1",
            fields: {
                sayHello:{
                    type: GraphQLString,
                    resolve: ()=>{
                        let name = "mohamed"
                        return name
                    }
                }
            }
        }),
        mutation: new GraphQLObjectType({
            name: "mutation1",
            fields: {
                sayHello:{
                    type: GraphQLString,
                    resolve: ()=>{
                        let name = "mohamed"
                        return name
                    }
                }
            }
        })
    })

    app.all('/graphql_1', createHandler({
        schema: mySchema_1,
        context: (req)=>{
            return {token: req.raw.headers.authorization}
        }
    }))






    app.use((err: IError, req: Request, res:Response, next: NextFunction)=>{
        res.status(err.statusCode).json({
            errMessage: err.message,
            validationError: err.validationError,
            status: err.statusCode,
            stack: err.stack
        })
    })


    const httpServer = app.listen(process.env.PORT,()=>{
        console.log(chalk.bgGreen.blue("server is running on port",process.env.PORT));
    })

    initializeIo(httpServer);
}



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
