
import { Socket } from "socket.io";
import { chatSocketService } from "./chat.socket.services";
import { chatEvents } from "./chat.event";

class ChatGateWay{
    register(socket:Socket){
        chatEvents.sendMessage(socket)
        chatEvents.joinRoom(socket)
        chatEvents.sendGroupMessage(socket)
    }
}

export const chatGateWay = new ChatGateWay()