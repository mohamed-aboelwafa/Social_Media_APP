import { ObjectId, Types } from "mongoose";
import { cancelFriendRequest, cancelFriendRequestData, FriendRequestReplayData, sendFriendRequestData } from "./user.validation";
import UserModel from "./models/user.model";
import { BadRequestException, NotFoundException, UnAuthorizedException } from "../../utils/error.exceptions";
import { FriendRequestModel } from "./models/friendRequest.model";
import { FriendRequestEnum } from "./types/friendRequest.types";
import { HUser } from "./types/user.types";


class UserServices{
    async sendFriendRequest({from , to}: sendFriendRequestData & {from: string}){
        if(from.toString()==to){
            throw new BadRequestException("cannot send to yourself")
        }
        const receiver = await UserModel.findById(to)
        if(!receiver){
            throw new NotFoundException("user not found")
        }
        const isFriendExist = await FriendRequestModel.findOne({
            status:{
                $in: [FriendRequestEnum.accepted, FriendRequestEnum.pending]
            },
            $or:[
                {from, to},
                {to: from, from: to}
            ]
        })
        if(isFriendExist){
            throw new BadRequestException("friend request already exist");
        }
        await FriendRequestModel.create({
            from,
            to,
        })

        return {data:{}}
    }

    async friendRequestReplay({id, status, userId}: FriendRequestReplayData & {userId:string}){
        const friendRequest = await FriendRequestModel.findOne({_id: id})
        if(!friendRequest){
            throw new NotFoundException("friend request not found")
        }

        if(friendRequest.to.toString() != userId){
            throw new UnAuthorizedException("unauthorized to replay to this friend request")
        }

        if(friendRequest.status != FriendRequestEnum.pending){
            throw new BadRequestException("request status must be pending")
        }

        friendRequest.status = status
        await friendRequest.save()

        return {
            data: {

            }
        }
    }

    async listFriendRequest({userId, isTo=true}:{userId: string | Types.ObjectId, isTo?: boolean}){
        const filter: {
            to?: string | Types.ObjectId
            from?: string | Types.ObjectId,
            status: FriendRequestEnum
        } = {
            to: userId, status: FriendRequestEnum.pending
        }
        if(isTo == false){
            delete filter.to
            filter.from = userId
        }
        const friendRequests = await FriendRequestModel.find(filter).populate([
            {
                path:"to",
                select:"name email _id"
            },
            {
                path:"from",
                select:"name email _id" 
            }
        ])
        return {
            data:{
                friendRequests
            }
        }
    }

    async cancelFriendRequest({userId, id}:cancelFriendRequestData & {userId: string}){
        const friendRequest = await FriendRequestModel.findById(id)
        if(!friendRequest){
            throw new NotFoundException("friend request not found")
        }
        if(friendRequest.from.toString()!=userId.toString()){
            throw new UnAuthorizedException("you are UnAuthorized to cancel this friend request")
        }
        if(friendRequest.status!=FriendRequestEnum.pending){
            throw new BadRequestException("this friend can't be canceled")
        }
        friendRequest.status = FriendRequestEnum.canceled
        await friendRequest.save()
        return {
            data: {}
        }
    }
    
    // async listFriend({user}:{user: HUser}){
    //     user = await user.populate([
    //         {
    //             path: "received",
    //             select:"_id from status",
    //             populate:[
    //                 {
    //                     path:"from",
    //                     select:"name email" 
    //                 }                        
    //             ]
    //         },
    //         {
    //             path: "sent",
    //             select:"_id from status",
    //             populate:[
    //                 {
    //                     path:"to",
    //                     select:"name email"
    //                 }               
    //             ]
    //         }
    //     ])

    //     return {
    //         data:{
    //             friends:[
    //                 ...user.received as [HUser],
    //                 ...user.sent as [HUser]
    //             ]
    //         }
    //     }

    // }

    async listFriends({userId}:{userId: Types.ObjectId | string}){
        const friendRequests = await FriendRequestModel.find({
            $or: [
                {from: userId},
                {to: userId}
            ],
            status: FriendRequestEnum.accepted
        })
        .populate([
            {
                path: "to",
                select: "email name phone",
                match: {
                    _id: {
                        $ne: userId
                    }
                }
            },
            {
                path: "from",
                select: "email name phone",
                match: {
                    _id: {
                        $ne: userId
                    }
                }
            }
        ])

        const friends = friendRequests.map(req=>{
            return req.to || req.from
        })
        return {
            data:{
                friends
            }
        }
    }
}

/*

*/

export const userServices = new UserServices()