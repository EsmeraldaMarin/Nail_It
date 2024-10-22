import nodemailer from "nodemailer" ;
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
    host:process.env.EMAIL_HOST,
    port:465,
    secure:true,
    auth:{
        user:process.env.EMAIL_USER,
        pass:process.env.EMAIL_PASSWORD,
    }
})

export async function enviarMailVerificacion(direccion, token){
    return transporter.sendMail({
        from:"Oh my nail <no-reply@ohmynail.com>",
        to:direccion,
        subject:"Verificación de nueva cuenta - OhMyNail",
        html: crearMailDeVerificacion(token)
    })
}

export async function enviarMailVerificacionAdmin(direccion, token){
    return transporter.sendMail({
        from:"Oh my nail <no-reply@ohmynail.com>",
        to:direccion,
        subject:"Verificación de nueva cuenta - OhMyNail",
        html: crearMailDeVerificacionParaAdmin(token)
    })
}



function crearMailDeVerificacion(token){
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title></title>
    </head>
    <body>
        <h1>Verificación de correo electrónico - Oh My Nails!</h1>
        <p>Se ha creado una cuenta con este correo en: Oh my nails!</p>
        <p>Si usted no creó la cuenta, desestime este correo.</p>
        <p>Si usted creó la cuenta, entonces verifique la cuenta. <a href="http://localhost:5050/verificar/${token}" target="_blank" rel="noopener noreferr"> Haciendo click aquí.</a></p>
        <p></p>
    </body>
    </html>
    `
}


function crearMailDeVerificacionParaAdmin(token){
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title></title>
    </head>
    <body>
        <h1>Verificación de correo electrónico - Oh My Nails!</h1>
        <p>Se ha creado una cuenta con este correo en: Oh my nails!</p>
        <p>Si usted no creó la cuenta, desestime este correo.</p>
        <p>Si usted creó la cuenta, entonces verifique la cuenta. <a href="http://localhost:5050/verificar/admin/${token}" target="_blank" rel="noopener noreferr"> Haciendo click aquí.</a></p>
        <p></p>
    </body>
    </html>
    `
}