
import { Router } from "express";
import * as userValidation from "./user.validation";
import { validation } from "../../middlewares/validation.middleware";
import {auth} from "../../modules/auth/auth.middleware";
import {userServices} from "./user.services";
import { successRes } from "../../utils/success.res";
import { FriendRequestModel } from "./models/friendRequest.model";

const router = Router();

export const routes = {
    base: "/user",
    sendFriendRequest: "/send-friend-request",
    FriendRequestReplay: "/friend-request-replay/:id"
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


export default router
