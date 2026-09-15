import { isValidObjectId } from "mongoose";
import z from "zod";

export const createCommentValidation = {
    body: z.strictObject({
        content: z.string(),
        postId: z.string().refine((value) => {
            return isValidObjectId(value)
        }, {
            error: "invalid post id value"
        })
    })
}

export type createCommentData =
    z.infer<typeof createCommentValidation.body>


export const getCommentsByPostIdValidation = {
    params: z.strictObject({
        postId: z.string().refine((value) => {
            return isValidObjectId(value)
        }, {
            error: "invalid post id value"
        })
    })
}


export const updateCommentValidation = {
    params: z.strictObject({
        id: z.string().refine((value) => {
            return isValidObjectId(value)
        }, {
            error: "invalid comment id value"
        })
    }),

    body: z.strictObject({
        content: z.string()
    })
}

export type updateCommentData =
    z.infer<typeof updateCommentValidation.body>


export const deleteCommentValidation = {
    params: z.strictObject({
        id: z.string().refine((value) => {
            return isValidObjectId(value)
        }, {
            error: "invalid comment id value"
        })
    })
}