import { HydratedDocument } from "mongoose"

export enum GenderEnum{
    male,
    female
}

export enum ProviderEnum{
    system,
    google
}

export enum RoleEnum{
    user,
    admin
}

export interface IUser{
    name: string
    email: string
    password: string
    age: number
    isOnline: boolean
    isActive: boolean
    gender: GenderEnum
    phone: string
    confirmedAt: Date 
    changedCredentialsAt: Date
    provider: ProviderEnum
    role: RoleEnum
    profilePic: string
    coverPics: string[]
    bio: string
    received?: [HUser]
    sent?: [HUser]
}

export type HUser = HydratedDocument<IUser>