
export const confirmEmailKey=(user_id:string)=>{
    return `users: ${user_id}:confirmEmailOtp`
}

export const jwtIdKey = (userId:string, jwtid:string)=>{
    return `users:${userId}:${jwtid}`
}