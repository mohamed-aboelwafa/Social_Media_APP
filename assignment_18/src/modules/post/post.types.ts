import { HydratedDocument, Types } from "mongoose";

export enum PostPrivacyEnum {
    public,
    friends,
    private
}

export interface IPost {
    title: string;
    content: string;
    attachments: string[];
    likes: Types.ObjectId[];
    privacy: PostPrivacyEnum;
    createdBy: Types.ObjectId;
    isDeleted: boolean;
    deletedAt?: Date;
}

export type HPost = HydratedDocument<IPost>;