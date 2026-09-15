import { Types, HydratedDocument } from "mongoose";


export interface IMessage{
    createdBy: Types.ObjectId
    content: string
    attachment?: string[]
    createdAt?: Date
    updatedAt?: Date
}

export type HMessage = HydratedDocument<IMessage>