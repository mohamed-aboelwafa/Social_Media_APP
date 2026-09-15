
import { model, Schema, Types } from "mongoose";
import { IPost, PostPrivacyEnum } from "./post.types";
import { CommentModel } from "../comment/comment.model";

export const postSchema = new Schema<IPost>({
    title:{
        type: String,
        required: true
    },
    attachments:{
        type: [String]
    },
    content:{
        type: String,
        required: function(this){
            return this.attachments.length == 0
        }
    },
    likes:{
        type: [Types.ObjectId],
        ref: "User"
    },
    privacy:{
        type: Number,
        default: PostPrivacyEnum.public
    },
    createdBy:{
        type: Types.ObjectId,
        ref: "User",
        required: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    deletedAt: {
        type: Date
    }
},
{
    timestamps: true,
    strictQuery: true,
    strict:true,
    optimisticConcurrency: true,
    toObject: {virtuals: true, getters: true},
    toJSON: { virtuals: true, getters: true},
})

postSchema.pre("findOneAndDelete", async function () {

    const postId = this.getQuery()._id

    await CommentModel.deleteMany({
        postId
    })

})

postSchema.pre("save", async function () {

    if (this.isModified("isDeleted") && this.isDeleted) {

        await CommentModel.updateMany(
            {
                postId: this._id,
                isDeleted: false
            },
            {
                isDeleted: true,
                deletedAt: new Date()
            }
        )
    }

})

export const PostModel = model("Post", postSchema)
