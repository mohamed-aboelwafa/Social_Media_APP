
import { Router } from "express";
import { auth } from "../auth/auth.middleware";
import { chatService } from "./chat.services";
import { successRes } from "../../utils/success.res";

const router = Router({
    mergeParams: true
})

export const routes = {
    base: "/chats",
    getChat: "/:id",
    createGroup: "/create-group",
    getGroupChat: "/get-group-chat/:id"
}

router.get(routes.getChat, auth, async(req,res)=>{
    const {user} = req
    const id = req.params.id as string
    const {data} = await chatService.getChat({user, id})
    return successRes({res, data})
} )

router.post(routes.createGroup, auth, async(req,res)=>{
    const {group, participants} = req.body
    const user = req.user
    const {data} = await chatService.createGroup({group, participants, user})
    return successRes({res, data})
})


router.get(routes.getGroupChat, auth, async(req,res)=>{
    const groupId = req.params.id as string
    const user = req.user
    const {data} = await chatService.getGroupChat({
        user,
        groupId
    })

    return successRes({
        res,
        data
    })
})

export default router