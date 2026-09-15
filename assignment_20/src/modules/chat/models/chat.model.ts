import { model, Schema, Types } from "mongoose";
import { IMessage } from "../types/message.type";
import { IChat } from "../types/chat.types";
// import { string } from "zod";

const messageSchema = new Schema<IMessage>(
    {
        attachment:{
            type: [String]
        },
        content: {
            type: String,
            required: function(this: IMessage){
                return this.attachment?.length == 0
            }
        },
        createdBy:{
            type: Types.ObjectId,
            required: true,
            ref: "User"
        }
    },
    {
        timestamps: true
    }
)

const chatSchema = new Schema<IChat>(
    {
        participants:{
            type: [Types.ObjectId],
            ref:"User"
        },
        messages: [messageSchema],
        group: String,
        groupImage: String,
        roomId: {
            type: String,
            unique: true
        },
        createdBy:{
            type: Types.ObjectId,
            required: true,
            ref: "User"
        }

    },
    {
        timestamps: true,
        strictQuery: true,
        strict:true,
        optimisticConcurrency: true,
        toObject: {virtuals: true, getters: true},
        toJSON: { virtuals: true, getters: true},
    }
)

export const chatModel = model("Chat", chatSchema)
