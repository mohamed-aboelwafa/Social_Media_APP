
import z from "zod";
import { isValidObjectId } from "mongoose";
import { FriendRequestEnum } from "./types/friendRequest.types";

export const sendFriendRequestSchema = {
    body: z.strictObject({
        to: z.string().refine((value)=>{
            return isValidObjectId(value)
        },{
            error: "invalid id value"
        })
    })
}

export type sendFriendRequestData = z.infer<typeof sendFriendRequestSchema.body>

export const FriendRequestReplaySchema = {
    body: z.strictObject({
        status: z.union([
            z.literal(FriendRequestEnum.accepted),
            z.literal(FriendRequestEnum.rejected)
        ])
    }),
    params: z.strictObject({
        id: z.string().refine((value)=>{
            return isValidObjectId(value)
        },{
            error: "invalid id value"
        }),
    }),
}

export type FriendRequestReplayData = 
    z.infer<typeof FriendRequestReplaySchema.body>
    & z.infer<typeof FriendRequestReplaySchema.params>