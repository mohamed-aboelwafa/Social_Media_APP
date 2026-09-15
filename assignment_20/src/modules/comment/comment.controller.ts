import { Router } from "express";
import { auth } from "../auth/auth.middleware";
import { validation } from "../../middlewares/validation.middleware";
import * as commentValidation from "./comment.validation";
import { commentServices } from "./comment.services";
import { successRes } from "../../utils/success.res";

const router = Router();

export const routes = {
    base: "/comments",

    createComment: "/",

    getCommentsByPostId: "/post/:postId",

    updateComment: "/:id",

    deleteComment: "/:id",

    hardDeleteComment: "/:id/hard-delete"
};

router.post(
    routes.createComment,
    auth,
    validation(commentValidation.createCommentValidation),
    async (req, res) => {

        const userId = req.user._id

        const body =
            req.body as commentValidation.createCommentData

        const { data } =
            await commentServices.createComment({
                ...body,
                userId
            })

        return successRes({
            res,
            data
        })
    }
)

router.get(
    routes.getCommentsByPostId,
    auth,
    validation(commentValidation.getCommentsByPostIdValidation),
    async (req, res) => {

        const postId = req.params.postId as string

        const { data } =
            await commentServices.getCommentsByPostId({
                postId
            })

        return successRes({
            res,
            data
        })
    }
)

router.patch(
    routes.updateComment,
    auth,
    validation(commentValidation.updateCommentValidation),
    async (req, res) => {

        const commentId = req.params.id as string

        const { content } =
            req.body as commentValidation.updateCommentData

        const { data } =
            await commentServices.updateComment({
                commentId,
                content
            })

        return successRes({
            res,
            data
        })
    }
)

router.delete(
    routes.deleteComment,
    auth,
    validation(commentValidation.deleteCommentValidation),
    async (req, res) => {

        const commentId = req.params.id as string

        await commentServices.deleteComment({
            commentId
        })

        return successRes({
            res,
            message: "comment deleted successfully"
        })
    }
)

router.delete(
    routes.hardDeleteComment,
    auth,
    validation(commentValidation.deleteCommentValidation),
    async (req, res) => {

        const commentId = req.params.id as string

        await commentServices.hardDeleteComment({
            commentId
        })

        return successRes({
            res,
            message: "comment hard deleted successfully"
        })
    }
)

export default router;