import { isValidObjectId } from "mongoose";
import z from "zod";

export const createPostValidation = {
    body:z.strictObject({
        title:z.string(),
        content:z.string(),
        privacy:z.union([
            z.literal(0), // public
            z.literal(1), // friends
            z.literal(2) // private
        ]).optional()
    })
}

export type createPostData = z.infer<typeof createPostValidation.body>

export const getPostsByUserIdValidation = {
        params: z.strictObject({
            id: z.string().refine((value)=>{
                return isValidObjectId(value)
            },{
                error: "invalid id value"
            }),
        }),
}

export const getPostByIdValidation = {
    params: z.strictObject({
        id: z.string().refine((value)=>{
            return isValidObjectId(value)
        },{
            error: "invalid id value"
        }),
    }),
}

export const updatePostValidation = {
    params: z.strictObject({
        id: z.string().refine((value) => {
            return isValidObjectId(value)
        }, {
            error: "invalid post id value"
        })
    }),

    body: z.strictObject({
        title: z.string().optional(),
        content: z.string().optional(),
        privacy: z.union([
            z.literal(0),
            z.literal(1),
            z.literal(2)
        ]).optional()
    })
}

export type updatePostData =
    z.infer<typeof updatePostValidation.body>

