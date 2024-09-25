import pkg from "express";
const { Router } = pkg
import { gestorAdmins } from "../index.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export const routerAdmins = Router();

routerAdmins.get("/", async (req, res) => {
    const datos = await gestorAdmins.obtener_admins();
    if (datos){
        res.status(200).json(datos);
    }else{
        res.status(500).send("Error!")
    }
})

routerAdmins.post("/registrar", async(req, res) => {
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
            return res.status(400).json({ message: "El email ya está registrado"});
        }

        const { password } = req.body;

        req.body.password = await bcrypt.hash(password, 10);

        const nuevoAdmin = await gestorAdmins.crear_admin(req.body);

        res.status(201).json(nuevoAdmin);

     }
     catch(error){
        res.status(400).json({error: error.message });
     }
})

routerAdmins.post("/login", async(req, res) => {
    try {
        // Obtener el usuario por email
        const usuario = await gestorAdmins.obtener_admin_por_email(req.body.email);

        // Verificar si el usuario existe
        if (!usuario) {
            return res.status(400).json({ message: "Email no registrado." });
        }

        // Comparar la contraseña
        const passwordMatch = await bcrypt.compare(req.body.password, usuario.password);
        if (!passwordMatch) {
            return res.status(400).json({ message: "Contraseña incorrecta." });
        }

        // Si las credenciales son válidas, puedes generar un token aquí
        const token = jwt.sign({ id: usuario.id }, 'tuSecreto', { expiresIn: '1h' });

        // Responder con el token y un mensaje de éxito
        res.status(200).json({ message: "Login exitoso!", token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

