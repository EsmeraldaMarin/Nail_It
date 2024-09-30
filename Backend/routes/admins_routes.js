import pkg from "express";
const { Router } = pkg
import { gestorAdmins } from "../index.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { GestorAdmins } from "../controllers/admin_controller.js";
import { enviarMailVerificacion, enviarMailVerificacionAdmin } from "../controllers/services/mail.services.js";

export const routerAdmins = Router();

routerAdmins.get("/", async (req, res) => {
    const datos = await gestorAdmins.obtener_admins();
    if (datos){
        res.status(200).json(datos);
    }else{
        res.status(500).send("Error!")
    }
})

routerAdmins.post("/registro", async(req, res) => {
     req.body.email = req.body.email.toLowerCase();
     try{
        // Validación
        if (!req.body.nombre || typeof req.body.nombre !== 'string' || req.body.nombre.trim() === '') {
            return res.status(400).json({ message: "Nombre del admin es requerido"});
        }
        if (!req.body.apellido || typeof req.body.apellido !== 'string' || req.body.apellido.trim() === '') {
            return res.status(400).json({ message: "Apellido del admin es requerido" });
        }
        if (!req.body.email || typeof req.body.email !== 'string' || req.body.email.trim() === '') {
            return res.status(400).json({ message: "Email del admin es requerido" });
        }
        if (!req.body.password || typeof req.body.apellido !== 'string' || req.body.apellido.trim() === '') {
            return res.status(400).json({ message: "Password del admin es requerido" });
        }

        const existingAdmin = await gestorAdmins.obtener_admin_por_email(req.body.email);
        if (existingAdmin){
            // return res.status(400).json({ message: "El email ya está registrado"});
        }

        const { password } = req.body;
        req.body.password = await bcrypt.hash(password, 10);

        const tokenVerificacion = jwt.sign(
            {user: req.body.email},
            process.env.JWT_SECRET,
            {expiresIn: process.env.JWT_EXPIRATION}
        )

        const mail = await enviarMailVerificacionAdmin(req.body.email, tokenVerificacion);
        console.log(mail);
        if (mail.accepted === 0){
           return res.status(500).send({status:"error", message:"Error enviando mail de verificación"})
        }

        const nuevoAdmin = {
            nombre: req.body.nombre,
             apellido: req.body.apellido,
             email: req.body.email,
             numero: req.body.numero,
             password: req.body.password,
             verificado: 0};

        const nuevoAd = await gestorAdmins.crear_admin(nuevoAdmin);

        res.status(201).json(nuevoAd);
     } catch(error){
        res.status(400).json({error: error.message });
     }
})

routerAdmins.post("/login", async (req, res) => {
    try {
        // Obtener el usuario por email
        const usuario = await gestorAdmins.obtener_admin_por_email(req.body.email);
        
        // Verificar si el usuario existe
        if (!usuario || usuario.verificado) {
            return res.status(400).json({ message: "Email no registrado o no verificado." });
        }

        // Comparar la contraseña
        const passwordMatch = await bcrypt.compare(req.body.password, usuario.password);
        if (!passwordMatch) {
            return res.status(400).json({ message: "Contraseña incorrecta." });
        }

        // Si las credenciales son válidas, puedes generar un token aquí
        
        const token = jwt.sign({user:usuario.mail}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRATION});
        const cookieOption = {
            expiresIn: process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 100,
            path: "/"
        }

        res.cookie("jwt", token, cookieOption);
        // Responder con el token y un mensaje de éxito
        res.status(200).json({message:"Admin loggeado", redirect:"/inicio"})
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

