import { nanoid } from "nanoid";
import { NotFoundException } from "../../utils/error.exceptions";
import UserModel from "../user/models/user.model";
import { HUser } from "../user/types/user.types";
import { chatModel } from "./models/chat.model";

class ChatService {
    async getChat({user,id}:{user:HUser,id:string}){
        const friend = await UserModel.findById(id)
        if(!friend){
            throw new NotFoundException("friend not found")
        }

        let chat = await chatModel.findOne({
            group: {
                $exists: false
            },
            participants: {
                $all: [friend._id, user._id]
            }
        })

        if (!chat) {
            chat = await chatModel.create({
                participants: [
                    friend._id, user._id
                ],
                createdBy: user._id
            })
        }

        await chat.populate("participants")

        return{
            data:{
                chat
            }
        }
    }

    async createGroup({group, participants, user}:{group: string, participants: string[], user: HUser}){

        const foundParticipants = await UserModel.find({
            _id: {
                $in: participants
            }
        })
        if(participants.length != foundParticipants.length){
            throw new NotFoundException("some participants not found")
        }
        const roomId = nanoid(15)
        const newGroup = await chatModel.create({
            participants,
            group,
            createdBy: user._id,
            roomId
        })

        return {
            data:{
                group: newGroup
            }
        }
    }

    async getGroupChat({groupId, user}:{user: HUser, groupId: string}){
        const chat = await chatModel.findOne({
            _id: groupId,
            group:{
                $exists: true
            },
            participants: {
                $in: [user._id]
            }
        }).populate("messages.createdBy")
        if(!chat){
            throw new NotFoundException("chat not found");
        }
        return {
            data: {
                chat
            }
        }
    }
}

export const chatService = new ChatService()