import express,{Request,Response,NextFunction} from "express";
import chalk from "chalk";
import morgan from "morgan";
import { DBConnection } from "./DB/mongoose.connection";
import { NotFoundException , IError } from "./utils/error.exceptions";
// import { ErrorRequestHandler } from "express";
import * as z from "zod";
import authRouter from "./modules/auth/auth.controller";

const app = express();
export const bootstrap = async ()=> {
    app.use(express.json());
    app.use(morgan("dev"));
    await DBConnection();

    app.use("/auth",authRouter);
    
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
    app.listen(process.env.PORT,()=>{
        console.log(chalk.bgGreen.blue("server is running on port",process.env.PORT));
    })
}
