import { model, Schema, Types } from "mongoose";
import { IComment } from "./comment.types";

export const commentSchema = new Schema<IComment>({
    content: {
        type: String,
        required: true
    },

    createdBy: {
        type: Types.ObjectId,
        ref: "User",
        required: true
    },

    postId: {
        type: Types.ObjectId,
        ref: "Post",
        required: true
    },

    isDeleted:{
        type: Boolean,
        default: false
    },

    deletedAt:{
        type: Date
    }
},
{
    timestamps: true,
    strictQuery: true,
    strict: true,
    optimisticConcurrency: true,
    toObject: { virtuals: true, getters: true },
    toJSON: { virtuals: true, getters: true }
})

export const CommentModel = model("Comment", commentSchema)

