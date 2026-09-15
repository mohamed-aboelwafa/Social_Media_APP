import { Types } from "mongoose";
import { CommentModel } from "./comment.model";
import { createCommentData } from "./comment.validation";
import { PostModel } from "../post/post.model";
import { NotFoundException } from "../../utils/error.exceptions";

class CommentServices {

    async createComment({
        content,
        postId,
        userId
    }: createCommentData & {
        userId: Types.ObjectId
    }) {

        const post = await PostModel.findOne({
            _id: postId,
            isDeleted: false
        })

        if (!post) {
            throw new NotFoundException("post not found")
        }

        const comment = await CommentModel.create({
            content,
            postId,
            createdBy: userId
        })

        return {
            data: {
                comment
            }
        }
    }

    async getCommentsByPostId({
        postId
    }: {
        postId: string
    }) {

        const post = await PostModel.findOne({
            _id: postId,
            isDeleted: false
        })

        if (!post) {
            throw new NotFoundException("post not found")
        }

        const comments = await CommentModel.find({
            postId,
            isDeleted: false
        })

        return {
            data: {
                comments
            }
        }
    }

    async updateComment({
        commentId,
        content
    }: {
        commentId: string,
        content: string
    }) {

        const comment = await CommentModel.findOne({
            _id: commentId
        })

        if (!comment) {
            throw new NotFoundException("comment not found")
        }

        comment.content = content

        await comment.save()

        return {
            data: {
                comment
            }
        }
    }

    async deleteComment({
        commentId
    }: {
        commentId: string
    }) {

        const comment = await CommentModel.findOne({
            _id: commentId,
            isDeleted: false
        })

        if (!comment) {
            throw new NotFoundException("comment not found")
        }

        comment.isDeleted = true
        comment.deletedAt = new Date()

        await comment.save()

        return {
            data: {}
        }
    }

    async hardDeleteComment({
        commentId
    }: {
        commentId: string
    }) {

        const comment = await CommentModel.findOne({
            _id: commentId
        })

        if (!comment) {
            throw new NotFoundException("comment not found")
        }

        await CommentModel.findOneAndDelete({
            _id: commentId
        })

        return {
            data: {}
        }
    }






}

export const commentServices = new CommentServices();


