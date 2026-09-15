import { model, models, Schema, Model } from "mongoose";
import {IUser , GenderEnum, ProviderEnum, RoleEnum} from "../types/user.types";
import { hash } from "../../../utils/security/hash";
import { encrypt, decrypt } from "../../../utils/security/encryption";
import { FriendRequestEnum } from "../types/friendRequest.types";
import { createOtp } from "../../../utils/email/createOtp";
import { generateHtml } from "../../../utils/email/template";
import { sendEmail } from "../../../utils/email/sendEmail";
import { redisClient } from "../../../DB/redis.connection";
import { confirmEmailKey } from "../../../utils/redis/redis.services";

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
            // get:function(value:string){
            //     return decrypt(value)
            // }
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


// userSchema.virtual("received",{
//     localField:"_id",
//     foreignField:"to",
//     ref:"FriendRequest",
//     match: {status: FriendRequestEnum.accepted}
// })

// userSchema.virtual("sent",{
//     localField:"_id",
//     foreignField:"from",
//     ref:"FriendRequest",
//     match: {status: FriendRequestEnum.accepted}
// })



userSchema.pre("save", async function(){
    console.log(this.isModified("password"));
        if(this.isNew || this.isModified("password")){
        this.password = await hash(this.password)
    }
    if(this.isNew){
        const otp = createOtp();
        sendEmail({to: this.email, subject:'confirm email', html:generateHtml(otp)})
        redisClient.set(confirmEmailKey(this.id),otp,{
            expiration:{
                type:"EX",
                value: 5*60
            }
        })
    }
})

userSchema.pre('findOne', function(){

    console.log(this.getQuery());
    const query = this.getQuery();
    this.setQuery({...query, isActive: true});
    console.log(this.getQuery());
})

userSchema.post('findOne',function(this,docs){
    // console.log(this.getQuery());
    
    console.log({docs});
    docs.phone = decrypt(docs.phone)    
})


// const UserModel = models.User || model("User", userSchema);

const UserModel: Model<IUser> =
    (models.User as Model<IUser>) || model<IUser>("User", userSchema);


export default UserModel;