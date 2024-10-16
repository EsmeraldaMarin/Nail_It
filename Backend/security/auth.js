import pkg from 'express';
const { Router } = pkg;
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { gestorAdmins, gestorClientes } from "../index.js";

dotenv.config();

export const routerVerificar = Router();


routerVerificar.get("/:token", async (req, res) => {
    try{
        if (!req.params.token){
            return res.redirect("/login");
        }

        const decodificar = jwt.verify(req.params.token, process.env.JWT_SECRET)

        if(!decodificar || !decodificar.user){
            return res.redirect("/login").status(500).send("Error en el token");
        }
        

        const token = jwt.sign({user:decodificar.email}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRATION});
        const cookieOption = {
            expiresIn: process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 100,
            path: "/"
        }

        const usuarioAValidar = await gestorClientes.obtener_cliente_por_email(decodificar.user);
        
        console.log("Usuario a validar: ", usuarioAValidar.dataValues)

        const usuarioAInsertar = {
            nombre: usuarioAValidar.nombre,
            apellido: usuarioAValidar.apellido,
            email: usuarioAValidar.email,
            verificado: true,
        }

        // Cuando funcione el 

        await gestorClientes.actualizar_cliente(usuarioAInsertar, usuarioAValidar.dataValues.id);
        // gestorAdmins.actualizar_admin_por_email(usuarioAInsertar, decodificar.user);
        
        res.cookie("jwt", token, cookieOption);
        res.redirect("http://localhost:3000/inicio");
        res.status(200);
        
    }catch(error){
        console.warn(error)
    }
})

routerVerificar.get("/admin/:token", (req, res) => {
    try{
        if (!req.params.token){
            return res.redirect("/admin/login");
        }

        const decodificar = jwt.verify(req.params.token, process.env.JWT_SECRET)

        if(!decodificar || !decodificar.user){
            return res.redirect("/admin/login").status(500).send("Error en el token");
        }
        

        const token = jwt.sign({user:decodificar.email}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRATION});
        const cookieOption = {
            expiresIn: process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 100,
            path: "/"
        }

        const usuarioAValidar = gestorAdmins.obtener_admin_por_email(decodificar.user);


        const usuarioAInsertar = {
            nombre: usuarioAValidar.nombre,
            apellido: usuarioAValidar.apellido,
            email: usuarioAValidar.email,
            numero: usuarioAValidar.numero,
            password: usuarioAValidar.password,
            verificado: true,
        }

        gestorAdmins.actualizar_admin_por_email(usuarioAInsertar, decodificar.user);
        
        res.cookie("jwt", token, cookieOption);
        res.redirect("http://localhost:3000/inicio_admin");
        res.status(200);
        
    }catch(error){
        console.warn(error)
    }
})