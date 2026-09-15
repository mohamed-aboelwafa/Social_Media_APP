
import { Router } from "express";
import * as userValidation from "./user.validation";
import { validation } from "../../middlewares/validation.middleware";
import {auth} from "../../modules/auth/auth.middleware";
import {userServices} from "./user.services";
import { successRes } from "../../utils/success.res";
import { FriendRequestModel } from "./models/friendRequest.model";
import chatRouter from "../auth/auth.controller";

const router = Router();

// router.use("/:id/chat", chatRouter)


export const routes = {
    base: "/user",
    sendFriendRequest: "/send-friend-request",
    FriendRequestReplay: "/friend-request-replay/:id",
    listFriendRequest:"/list-friend-requests",
    cancelFriendRequest: "/cancel-friend-request/:id",
    listFriends:"/list-friends"
}


router.post(
    routes.sendFriendRequest,
    validation(userValidation.sendFriendRequestSchema),
    auth,
    async(req,res)=>{
        const {to} = req.body as userValidation.sendFriendRequestData
        const {id: from} = req.user
        await userServices.sendFriendRequest({to, from})
        return successRes({res})
    }
)

router.patch(
    routes.FriendRequestReplay,
    validation(userValidation.FriendRequestReplaySchema),
    auth,
    async(req,res)=>{
        const {id} = req.params as {id: string}
        const {status} = req.body
        const {id: userId} = req.user
        await userServices.friendRequestReplay({id, status, userId})
        return successRes({res})
    }
)

router.get(
    routes.listFriendRequest,
    auth,
    async (req,res)=>{
        const userId = req.user._id
        const {isTo = true} = req.query
        const {data} = await userServices.listFriendRequest({userId, isTo:JSON.parse(isTo as string)})
        return successRes({
            res,
            data
        })
    }
)

router.patch(
    routes.cancelFriendRequest,
    validation(userValidation.cancelFriendRequest),
    auth,
    async(req,res)=>{
        const {id} = req.params as userValidation.cancelFriendRequestData
        const userId = req.user.id
        await userServices.cancelFriendRequest({id, userId})
        return successRes({res})
    }
)

router.get(
    routes.listFriends,
    auth,
    async(req,res)=>{
        const user = req.user
        const {data} = await userServices.listFriends({userId: user._id})
        return successRes({res, data})
    }
)

export default router
