
import CryptoJS from "crypto-js";

export const encrypt=(data:string)=>{
    const encryptedData = CryptoJS.AES.encrypt(
        data,
        process.env.ENC_KEY as string,
    ).toString();

    return encryptedData;
}

export const decrypt = (encryptedData:string)=>{
    const decryptedData = CryptoJS.AES.decrypt(
        encryptedData,
        process.env.ENC_KEY as string
    );

    return decryptedData.toString(CryptoJS.enc.Utf8);
};