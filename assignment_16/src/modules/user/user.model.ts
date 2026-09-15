import { model, models, Schema } from "mongoose";
import {IUser , GenderEnum, ProviderEnum, RoleEnum} from "./user.types";

const userSchema = new Schema<IUser>({
        name: {
            type: String,
            required: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
        },

        password: {
            type: String,
            required: true,
        },

        age: {
            type: Number,
        },

        phone: {
            type: String,
        },

        bio: {
            type: String,
        },

        isOnline: {
            type: Boolean,
            default: false,
        },

        isActive: {
            type: Boolean,
            default: false,
        },

        gender: {
            type: Number,
            enum: GenderEnum,
            default: GenderEnum.male,
        },

        confirmedAt: {
            type: Date,
        },

        changedCredentialsAt: {
            type: Date,
        },

        provider: {
            type: Number,
            enum: ProviderEnum,
            default: ProviderEnum.system,
        },

        role: {
            type: Number,
            enum: RoleEnum,
            default: RoleEnum.user,
        },

        profilePic: {
            type: String,
        },

        coverPics: [
            {
                type: String,
            },
        ],
    },
    {
        timestamps: true,
        toObject: {virtuals: true},
        toJSON: { virtuals: true },
    },
);


const UserModel = models.User || model("User", userSchema);

export default UserModel;