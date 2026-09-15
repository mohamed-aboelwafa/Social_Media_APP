
import { model, Schema, Types } from "mongoose";
import { FriendRequestEnum, IFriendRequest } from "../types/friendRequest.types";


const friendRequestSchema = new Schema<IFriendRequest>({
    from: {
        type: Types.ObjectId,
        required: true,
        ref: "User"
    },
    to:{
        type: Types.ObjectId,
        required: true,
        ref: "User"
    },
    status:{
        type: Number,
        default: FriendRequestEnum.pending
    }
} , {
    timestamps: true,
    strictQuery: true,
    strict:true,
    optimisticConcurrency: true,
    toObject: {virtuals: true, getters: true},
    toJSON: { virtuals: true, getters: true},
})

export const FriendRequestModel = model("FriendRequest", friendRequestSchema)