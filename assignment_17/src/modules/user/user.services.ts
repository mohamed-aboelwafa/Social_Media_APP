import { ObjectId } from "mongoose";
import { FriendRequestReplayData, sendFriendRequestData } from "./user.validation";
import UserModel from "./models/user.model";
import { BadRequestException, NotFoundException, UnAuthorizedException } from "../../utils/error.exceptions";
import { FriendRequestModel } from "./models/friendRequest.model";
import { FriendRequestEnum } from "./types/friendRequest.types";


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
}

export const userServices = new UserServices()