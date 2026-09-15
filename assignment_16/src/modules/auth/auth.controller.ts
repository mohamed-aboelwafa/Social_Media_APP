
import {Router} from 'express';
import {validation} from '../../middlewares/validation.middleware';
import { loginSchema } from './auth.validation';
import { loginService } from './auth.services';
const router = Router();

router.post('/login',validation(loginSchema),(req,res,next)=>{
    const {data} = loginService(req.body, req.query)
    res.json({data})
})

export default router;
