import { Router } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { gestorClientes } from "../index.js";

dotenv.config();

export const routerVerificar = Router();


routerVerificar.get("/:token", (req, res) => {
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

        const usuarioAValidar = gestorClientes.obtener_cliente_por_email(decodificar.user);

        const usuarioAInsertar = {
            nombre: usuarioAValidar.nombre,
            apellido: usuarioAValidar.apellido,
            email: usuarioAValidar.email,
            numero: usuarioAValidar.numero,
            password: usuarioAValidar.password,
            verificado: true,
        }

        gestorClientes.actualizar_cliente(usuarioAInsertar, decodificar.user);

        res.cookie("jwt", token, cookieOption);
        res.redirect("http://localhost:3000/inicio");
        res.status(200);
        
    }catch(error){
        console.warn(error)
    }
})