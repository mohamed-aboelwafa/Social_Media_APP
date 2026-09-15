
// import {Router} from 'express';
// import {validation} from '../../middlewares/validation.middleware';
// import { loginSchema } from './auth.validation';
// import { loginService } from './auth.services';
// const router = Router();

// router.post('/login',validation(loginSchema),(req,res,next)=>{
//     const {data} = loginService(req.body, req.query)
//     res.json({data})
// })

// export default router;

import {Router} from 'express';
import { authServices } from './auth.services';
import { GenderEnum } from '../user/types/user.types';
import * as authValidation from './auth.validation';
import { successRes } from '../../utils/success.res';
import { validation } from '../../middlewares/validation.middleware';
import { auth } from './auth.middleware';
import { chatModel } from '../chat/models/chat.model';
const router = Router();

export const routes = {
    base: "/auth",
    signup: "/signup",
    confirmEmail: "/confirm-email",
    login:"/login",
    resendConfirmEmailOtp: "/resend-confirm-email-otp",
    me: "/me"
}

// authServices.signup({
//     bio:"jkghl" ,
//     email:"m@gmail.com" , 
//     gender:GenderEnum.male , 
//     name:"mohamed" , 
//     password:"mo123", 
//     phone:"01155681630", 
//     age:24
// })

router.post(routes.signup, validation(authValidation.signupSchema), async (req,res)=>{
    const signupData = req.body as authValidation.signupData
    const {data} = await authServices.signup(signupData)
    return successRes({res, data, statusCode:201})
})

router.patch(routes.confirmEmail, validation(authValidation.confirmEmailSchema), async (req,res)=>{

    const body = req.body as authValidation.confirmEmailData
    await authServices.confirmEmail(body)
    return successRes({res})
})

router.post(routes.login, validation(authValidation.loginSchema), async (req, res) => {
    const body = req.body as authValidation.loginData;

    const { data } = await authServices.login(body);

    return successRes({
        res,
        data
    });
});

router.patch(routes.resendConfirmEmailOtp, validation(authValidation.resendConfirmEmailSchema), async(req,res)=>{
    const body = req.body as authValidation.resendConfirmEmailData
    await authServices.resentOtp(body)
    return successRes({
        res
    })
})

router.get(routes.me, auth, async(req,res)=>{
    const user = req.user
    const groups = await chatModel.find({
        participants:{
            $in: [req.user._id]
        },
        group:{
            $exists: true
        }
    })
    return successRes({
        res,
        data: {
            user,
            groups
        }
    })
})

export default router;