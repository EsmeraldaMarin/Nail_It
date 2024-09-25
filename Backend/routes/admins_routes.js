import pkg from "express";
const { Router } = pkg
import { gestorAdmins } from "../index.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export const routerAdmins = Router();

routerAdmins.get("/admins", async (req, res) => {
    const datos = await gestorAdmins.obtener_admins();
    if (datos){
        res.status(200).json(datos);
    }else{
        res.status(500).send("Error!")
    }
})

routerAdmins.post("/registrarAdmin", async(req, res) => {
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

        const existingAdmin = await gestorAdmins.obtener_admins_por_email(req.body.email);
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