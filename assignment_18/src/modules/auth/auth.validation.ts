import z, { email } from "zod";
import { GenderEnum } from "../user/types/user.types";
// import { schemaType } from "../../middlewares/validation.middleware";


export const loginSchema = {
    body: z.object({
        email: z.email(),
        password: z.string().regex(
            /^(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*()_-])(?=.*[0-9]).{8,}$/
        )
    })
};

export const signupSchema={
    body: z.strictObject({
        name: z.string(),
        email: z.email(),
        password: z.string().regex(new RegExp(/^(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*()_-])(?=.*[0-9]).{8,}$/)),
        age: z.number().optional(),
        gender: z.union([
            z.literal(GenderEnum.male),
            z.literal(GenderEnum.female),
        ]),
        bio: z.string().min(10),
        phone: z.string()
    })
}


// export type loginDTOBody = z.infer<typeof loginSchema.body>

export type signupData = z.infer<typeof signupSchema.body>
export type loginData = z.infer<typeof loginSchema.body>

export const confirmEmailSchema ={
    body: z.strictObject({
        email: z.email(),
        otp: z.string().min(6).max(6)
    })
}

export type confirmEmailData = z.infer<typeof confirmEmailSchema.body>

export const resendConfirmEmailSchema ={
    body: z.strictObject({
        email: z.email(),
    })
}

export type resendConfirmEmailData = z.infer<typeof resendConfirmEmailSchema.body>

