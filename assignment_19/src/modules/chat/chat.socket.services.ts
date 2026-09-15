
import { Socket } from "socket.io";
import UserModel from "../user/models/user.model";
import { NotFoundException } from "../../utils/error.exceptions";
import { chatModel } from "./models/chat.model";
import { redisClient } from "../../DB/redis.connection";
import { connectedSocketsKey } from "../../utils/redis/redis.services";
import { from } from "node:stream/iter";

class ChatSocketService{

    async sendMessage(
        {
            data,
            socket
        }:
        {
            socket: Socket,
            data:{
                content: string,
                sendTo: string
            }
        }
    ){
        try{
            const createdBy = socket.user._id
            const {content, sendTo} = data
            const friend = await UserModel.findById(sendTo)
            if(!friend){
                throw new NotFoundException("friend not found")
            }
            const chat = await chatModel.findOne({
                group:{
                    $exists: false
                },
                participants: {
                    $all: [friend._id, createdBy]
                }
            })
            if(!chat){
                throw new NotFoundException("chat not found")
            }
            chat.messages.push({
                createdBy,
                content
            })
            await chat.save()
            socket.emit("successMessage", content)
            let friendSockets : string | null | string[] = await redisClient.get(connectedSocketsKey(friend.id))
            if(friendSockets){
                socket.to(JSON.parse(friendSockets)).emit("newMessage",{
                    content,
                    from: socket.user
                })
            }
        }catch(error){
            socket.emit("custom_error", error)
        }
    }

    async joinRoom(socket: Socket, roomId: string){
        try {
            const group = await chatModel.findOne({
                group: {
                    $exists: true
                },
                participants: {
                    $in: [socket.user._id]
                },
                roomId
            })
            if(!group){
                throw new NotFoundException("group not found");
            }
            socket.join(roomId)
        } catch (error) {
            socket.emit("custom__error", error)
        }
    }

    async sendGroupMessage(socket: Socket, {content, groupId}: {content: string, groupId: string}){
        try {
            const createdBy = socket.user._id
            const group = await chatModel.findOne({
                group: {
                    $exists: true
                },
                participants: {
                    $in: [createdBy]
                },
                _id: groupId
            })
            if(!group){
                throw new NotFoundException("group not found")
            }
            group.messages.push({
                content,
                createdBy
            })
            await group.save()
            socket.emit("successMessage", content)
            socket.to(group.roomId as string).emit("newMessage",{
                content,
                from: socket.user,
                groupId
            })
        } catch (error) {
            socket.emit("custom_error", error)
        }
    }


}

export const chatSocketService = new ChatSocketService()


