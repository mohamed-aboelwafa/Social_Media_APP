import { HydratedDocument, Types } from "mongoose";

export interface IComment {
    content: string;
    createdBy: Types.ObjectId;
    postId: Types.ObjectId;
    isDeleted: boolean,
    deletedAt?: Date
}

export type HComment = HydratedDocument<IComment>;

