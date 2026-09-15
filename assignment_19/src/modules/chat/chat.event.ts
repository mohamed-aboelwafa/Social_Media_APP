
import { Socket } from "socket.io";
import { chatSocketService } from "./chat.socket.services";

class ChatEvents {

    async sendMessage(socket: Socket){
        socket.on("sendMessage", (data)=>{
            return chatSocketService.sendMessage({data, socket})
        })
    }

    async joinRoom(socket: Socket){
        socket.on("join_room", ({roomId}:{roomId: string})=>{
            return chatSocketService.joinRoom(socket, roomId)
        })
    }

    async sendGroupMessage(socket: Socket){
        socket.on("sendGroupMessage",({content, groupId}:{
            content: string,
            groupId: string
        })=>{
            return chatSocketService.sendGroupMessage(socket, {content, groupId})
        })
    }

}

export const chatEvents = new ChatEvents()