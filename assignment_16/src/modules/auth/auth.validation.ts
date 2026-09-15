import z from "zod";
import { schemaType } from "../../middlewares/validation.middleware";

export const loginSchema: schemaType = {
    body: z.object({
        email: z.email(),
        password: z.string().regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*()_-])(?=.*[0-9]).{8,}$/)
    }),
    query: z.strictObject({
        age: z.number()
        // age: z.string()
    })
}

export type loginDTOBody = z.infer<typeof loginSchema.body>
export type loginDTOQuery = z.infer<typeof loginSchema.query>

/*
export interface ILoginData{
    email: string
    password: string
    age: number
}
*/