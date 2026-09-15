import { HydratedDocument, Types } from "mongoose";
import { IMessage } from "./message.type";

export interface IChat {
    participants: Types.ObjectId[]
    messages: IMessage[]

    group?: string
    groupImage?: string
    roomId?: string

    createdBy: Types.ObjectId
    createdAt: Date
    updatedAt: Date
}

export type HChat = HydratedDocument<IChat>