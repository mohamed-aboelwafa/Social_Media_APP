
import { HydratedDocument, Types } from "mongoose";

export enum FriendRequestEnum{
    pending,
    accepted,
    rejected,
    canceled
}

export interface IFriendRequest{
    from: Types.ObjectId,
    to: Types.ObjectId,
    status: FriendRequestEnum
}

export type HFriendRequest = HydratedDocument<IFriendRequest>