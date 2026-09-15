import { model, models, Schema, Model } from "mongoose";
import {IUser , GenderEnum, ProviderEnum, RoleEnum} from "../types/user.types";
import { hash } from "../../../utils/security/hash";
import { encrypt, decrypt } from "../../../utils/security/encryption";

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
            required: function(this){
                return this.provider == ProviderEnum.system
            }
        },

        age: {
            type: Number,
        },

        phone: {
            type: String,
            set: function(this:IUser , value:string){
                const encryptedPhone = encrypt(value)
                return encryptedPhone
            },
            get:function(value:string){
                return decrypt(value)
            }
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
        strictQuery: true,
        strict:true,
        optimisticConcurrency: true,
        toObject: {virtuals: true, getters: true},
        toJSON: { virtuals: true, getters: true},
    },
);


// const UserModel = models.User || model("User", userSchema);

const UserModel: Model<IUser> =
    (models.User as Model<IUser>) || model<IUser>("User", userSchema);

// userSchema.pre("save",async function(this:IUser){
//     if(this.isNew("password")){

//     }
//     this.password = await hash(this.password)
// })

export default UserModel;