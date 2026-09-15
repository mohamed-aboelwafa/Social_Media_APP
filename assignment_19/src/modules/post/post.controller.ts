import {Router} from 'express';
import {auth} from "../auth/auth.middleware";
import {validation} from "../../middlewares/validation.middleware";
import * as postValidation from "./post.validation";
import {postServices} from './post.services';
import {successRes} from "../../utils/success.res";

const router = Router();

export const routes = {
    base: "/posts",

    createPost: "/",

    getHomePagePosts: "/",

    getPostsByUserId: "/userid/:id",

    getPostById: "/:id",

    updatePost: "/:id",

    softDeletePost: "/:id",

    hardDeletePost: "/:id/hard-delete",

    reactToPost: "/:id/react"
};



router.post(
    routes.createPost,
    auth,
    validation(postValidation.createPostValidation),
    async (req,res)=>{
        const userId = req.user._id
        const body = req.body as postValidation.createPostData
        const {data} = await postServices.createPost({...body, userId})
        return successRes({
            res,
            data
        })
    }
)


router.get(
    routes.getHomePagePosts,
    auth,
    async(req,res)=>{
        const user = req.user
        const {data} = await postServices.getHomePagePosts({user})
        return successRes({
            res,
            data
        })
    }
)


router.get(
    routes.getPostsByUserId,
    auth,
    validation(postValidation.getPostsByUserIdValidation),
    async (req,res)=>{
        const user = req.user
        const id = req.params.id as string
        const {data} = await postServices.getPostsByUserId({
            user,
            userId: id
        })

        return successRes({
            res, data
        })
    }
)


router.get(
    routes.getPostById,
    auth,
    validation(postValidation.getPostByIdValidation),
    async (req, res) => {

        const user = req.user

        const postId = req.params.id as string

        const { data } = await postServices.getPostById({
            postId,
            user
        })

        return successRes({
            res,
            data
        })
    }
)


router.delete(
    "/:id",
    auth,
    validation(postValidation.getPostsByUserIdValidation),
    async(req,res)=>{

        const userId = req.user._id

        const postId = req.params.id as string

        await postServices.softDeletePost({
            postId,
            userId
        })

        return successRes({
            res,
            message: "post soft deleted successfully"
        })
    }
)


router.delete(
    routes.hardDeletePost,

    auth,

    validation(
        postValidation.getPostsByUserIdValidation
    ),

    async (req, res) => {

        const userId =
            req.user._id;

        const postId =
            req.params.id as string;

        await postServices.hardDeletePost({
            postId,
            userId
        });

        return successRes({
            res,
            message: "post hard deleted successfully"
        });
    }
);


router.patch(
    routes.updatePost,
    auth,
    validation(postValidation.updatePostValidation),
    async (req, res) => {

        const userId = req.user._id

        const postId = req.params.id as string

        const body =
            req.body as postValidation.updatePostData

        const { data } =
            await postServices.updatePost({
                postId,
                userId,
                data: body
            })

        return successRes({
            res,
            data
        })
    }
)

router.patch(
    routes.reactToPost,
    auth,
    validation(postValidation.reactToPostValidation),
    async (req, res) => {

        const userId = req.user._id
        const postId = req.params.id as string
        const { reaction } =
            req.body as postValidation.reactToPostData

        const { data } = await postServices.reactToPost({
            postId,
            userId,
            reaction
        })

        return successRes({ res, data })
    }
)

export default router;