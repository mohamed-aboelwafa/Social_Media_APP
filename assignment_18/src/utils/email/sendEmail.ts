
import nodemailer from 'nodemailer';

export const sendEmail = async({to, subject, html}:{
    to:string,
    subject:string,
    html:string
})=>{
    const transporter = nodemailer.createTransport({
        host: "smtp.example.com",
        port: 587,
        service: "gmail",
        auth:{
            user: "mohamed@gmail.com",
            pass: "mo123"
        }
    })

    const info = await transporter.sendMail({
        from: '"Example Team" <team@example.com>',
        to,
        subject,
        html
    })
    console.log(info.accepted);
    
}