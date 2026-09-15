import {Types} from "mongoose";
import { PostModel } from "./post.model";
import { HUser } from "../user/types/user.types";
import { FriendRequestModel } from "../user/models/friendRequest.model";
import { FriendRequestEnum } from "../user/types/friendRequest.types";
import { PostPrivacyEnum } from "./post.types";
import { userServices } from "../user/user.services";
import { BadRequestException, NotFoundException } from "../../utils/error.exceptions";
import { createPostData, updatePostData } from "./post.validation";

class PostServices{
    async createPost({content, title, privacy, userId}: createPostData & {userId: Types.ObjectId}) {
        const post = await PostModel.create({
            content,
            createdBy: userId,
            privacy: privacy as number,
            title
        })
        return {
            data:{
                post
            }
        }
    }

    // get posts by user id
    async getPostsByUserId({userId, user}:{userId: string | Types.ObjectId, user: HUser}){
        const isFriends = await FriendRequestModel.findOne({
            status: FriendRequestEnum.accepted,
            $or:[
                {
                    to: userId,
                    from: user._id
                },
                {
                    to: user._id,
                    from: userId
                }
            ]
        })

        const postsPrivacy = [
            {privacy: PostPrivacyEnum.public}
        ]

        if(isFriends){
            postsPrivacy.push({privacy: PostPrivacyEnum.friends})
        }
        if(userId == user._id.toString()){
            postsPrivacy.push({privacy: PostPrivacyEnum.friends}, {privacy: PostPrivacyEnum.private})
        }
        const posts = await PostModel.find({
            createdBy: userId,
            isDeleted: false,
            $or: postsPrivacy
        })

        return {
            data:{
                posts
            }
        }
            
    }

    async getHomePagePosts({user}:{user:HUser}){
        const friends = (await userServices.listFriends({userId: user.id})).data.friends.map(friend=>friend._id)

        const privacy = [
            {privacy: PostPrivacyEnum.public},
            {
                privacy: PostPrivacyEnum.friends,
                createdBy: {
                    $in: friends
                }
            },
            {
                privacy: {
                    $in:[PostPrivacyEnum.friends, PostPrivacyEnum.private]
                },
                createdBy: user._id
            }
        ]

        const posts = await PostModel.find({
            isDeleted: false,
            $or: privacy
        })


        return {
            data: posts
        }
    }

    async getPostById({
        postId,
        user
    }: {
        postId: string,
        user: HUser
    }) {

        const post = await PostModel.findOne({
            _id: postId,
            isDeleted: false
        })

        if (!post) {
            throw new NotFoundException("post not found")
        }

        return {
            data: {
                post
            }
        }
    }

    async softDeletePost({
        postId,
        userId
    }: {
        postId: string,
        userId: Types.ObjectId
    }){

        const post = await PostModel.findOne({
            _id: postId
        })

        if(!post){
            throw new NotFoundException("post not found")
        }

        if(post.createdBy.toString() !== userId.toString()){
            throw new BadRequestException(
                "you are not allowed to delete this post"
            )
        }

        post.isDeleted = true
        post.deletedAt = new Date()

        await post.save()

        return {
            data: {}
        }
    }

    async hardDeletePost({
        postId,
        userId
    }: {
        postId: string,
        userId: Types.ObjectId
    }) {

        const post = await PostModel.findOne({
            _id: postId
        });

        if (!post) {
            throw new NotFoundException("post not found");
        }

        if (
            post.createdBy.toString() !==
            userId.toString()
        ) {
            throw new BadRequestException(
                "you are not allowed to delete this post"
            );
        }

        await PostModel.findOneAndDelete({
            _id: postId
        });

        return {
            data: {}
        };
    }

    async updatePost({
        postId,
        userId,
        data
    }: {
        postId: string,
        userId: Types.ObjectId,
        data: updatePostData
    }) {

        const post = await PostModel.findOne({
            _id: postId,
            isDeleted: false
        })

        if (!post) {
            throw new NotFoundException("post not found")
        }

        if (post.createdBy.toString() !== userId.toString()) {
            throw new BadRequestException(
                "you are not allowed to update this post"
            )
        }

        Object.assign(post, data)

        await post.save()

        return {
            data: {
                post
            }
        }
    }

}

export const postServices = new PostServices();