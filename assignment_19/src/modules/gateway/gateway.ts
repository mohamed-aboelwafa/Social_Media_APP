import { Server as httpServer} from "http";
import { Server, Socket } from "socket.io";
import { decodedToken } from "../auth/auth.middleware";
import { redisClient } from "../../DB/redis.connection";
import { connectedSocketsKey } from "../../utils/redis/redis.services";
import { chatGateWay } from "../chat/chat.gateway";

// const connectedSockets:Map<string,string[]> = new Map()

export const initializeIo = (httpServer: httpServer)=>{
    const io = new Server(httpServer, {
        cors:{
            origin: "*"
        }
    })


    io.use(async (socket,next)=>{
        try{
            const token = socket.handshake.auth.token

            const {user} = await decodedToken({authorization: token})
            socket.user = user
            next()
        } catch(err){
            // console.log({err});
            next(err as Error)
        }
    })

    io.on("connection", (socket: Socket)=>{

        registerNewUser(socket)      
        socket.on("disconnect",()=>{
            revokeUser(socket)
        })

        chatGateWay.register(socket)
    })
}


const registerNewUser = async (socket:Socket)=>{
    let userSockets : string | null | string[] = await redisClient.get(connectedSocketsKey(socket.user.id))
    if(userSockets){
        userSockets = JSON.parse(userSockets)
        await redisClient.set(connectedSocketsKey(socket.user.id), JSON.stringify([socket.id, ...userSockets as []]))
    } else{
        await redisClient.set(connectedSocketsKey(socket.user.id), JSON.stringify([socket.id]))
    }
}

const revokeUser = async (socket: Socket)=>{
    let userSockets = await redisClient.get(connectedSocketsKey(socket.user.id))
    let newUserSockets = JSON.parse(userSockets as string) as string[]
    newUserSockets = newUserSockets.filter((ele)=>{
        return ele != socket.id
    })
    if(newUserSockets.length == 0){
        await redisClient.del(connectedSocketsKey(socket.user.id))
    } else{
        await redisClient.set(connectedSocketsKey(socket.user.id), JSON.stringify(newUserSockets))
    }
}