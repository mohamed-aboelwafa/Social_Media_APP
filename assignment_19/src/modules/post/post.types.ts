

import { HydratedDocument, Types } from "mongoose";

export enum PostPrivacyEnum {
    public,
    friends,
    private
}

export enum ReactionEnum {
    like,
    love,
    haha,
    sad,
    angry
}

export interface IPost {
    title: string;
    content: string;
    attachments: string[];
    likes: Types.ObjectId[];
    reactions: {
        userId: Types.ObjectId;
        reaction: ReactionEnum;
    }[];
    privacy: PostPrivacyEnum;
    createdBy: Types.ObjectId;
    isDeleted: boolean;
    deletedAt?: Date;
}

export type HPost = HydratedDocument<IPost>;