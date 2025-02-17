import { Router } from 'express';
import crypto from "crypto";
import nodemailer from "nodemailer";
import { gestorClientes, gestorAdmins } from '../../index.js';
import dotenv from "dotenv";
import bcrypt from "bcryptjs"
const routerPassword = Router();

// Endpoint para solicitar restablecimiento de contraseña
routerPassword.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;

        // Verificar si el correo existe en clientes o admins
        const cliente = await gestorClientes.obtener_cliente_por_email(email);
        const admin = await gestorAdmins.obtener_admin_por_email(email);

        if (!cliente && !admin) {
            return res.status(404).json({ message: "Correo no registrado" });
        }

        // Generar un token único
        const token = crypto.randomBytes(32).toString('hex');

        // Guardar el token en la base de datos con una expiración de 1 hora
        const usuario = cliente || admin; // Tomar el que exista
        await usuario.update(
            { reset_token: token, reset_expiration: Date.now() + 3600000 }, // 1 hora
            { where: { email } }
        );

        dotenv.config();

        // Configuración del servicio de correo (gmail en este caso)
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER, // Carga desde variables de entorno
                pass: process.env.EMAIL_PASSWORD
            }
        });

        // Link de restablecimiento
        const resetLink = `http://localhost:3000/reset-password/${token}`;

        // Enviar el correo
        await transporter.sendMail({
            to: email,
            subject: "Recuperación de contraseña",
            html: `<p>Haga clic en el siguiente enlace para restablecer su contraseña:</p>
                   <a href="${resetLink}">${resetLink}</a>`
        });

        res.json({ message: "Correo enviado. Revisa tu bandeja de entrada" });
    } catch (error) {
        console.error("Error en forgot-password:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
});

routerPassword.post('/reset-password/:token', async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    // Verificar si el token es válido

    const cliente = await gestorClientes.obtener_cliente_por_token(token, Date.now())
    const admin = await gestorAdmins.obtener_admin_por_token(token, Date.now())

    if (!cliente && !admin) {
        return res.status(400).json({ message: "Token inválido o expirado" });
    }

    // Encriptar la nueva contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Actualizar la contraseña en la base de datos
    const usuario = cliente || admin;
    await usuario.update({
        password: hashedPassword,
        reset_token: null,
        reset_expiration: null
    })

    res.json({ message: "Contraseña restablecida correctamente" });
});


export default routerPassword;
