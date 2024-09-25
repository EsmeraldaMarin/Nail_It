import pkg from "express";
const { Router } = pkg
import { gestorClientes } from "../index.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { Clientes } from "../db/cliente_tabla.js";

export const routerClientes = Router();

routerClientes.get("/clientes", async (req, res) => {
    const datosClientes = await gestorClientes.obtener_clientes();
    if (datosClientes) {
        res.status(200).json(datosClientes);
    } else {
        res.status(500).send("Error!");
    }
});

routerClientes.get("/cliente/:id", async (req, res) => {
    const id = req.params.id;
    const datos = await gestorClientes.obtener_cliente(id);
    if (datos) {
        res.status(200).json(datos.email);
    } else {
        res.status(404).send("Cliente inexistente");
    }
});

/* routerClientes.get("/clientes/:email", async (req, res) => {
    const email = req.params.email;
    const datos = await gestorClientes.obtener_cliente_por_email(email);
    if (datos) {
        res.status(200).json(datos.email);
    } else {
        res.status(404).send("Cliente inexistente");
    }
}); */

routerClientes.put("/cliente/:email", async (req, res) => {


    try{
        
        const email = req.params.email.toLowerCase();

        const clienteExistente = await gestorClientes.obtener_cliente_por_email(email);

        console.log(email + " : " + clienteExistente);
        
        if (!clienteExistente){
            return res.status(401).send("Cliente no encontrado");
        }

        const {password} = req.body ;

        req.body.password = await bcrypt.hash(password, 10);

        const updateCliente = await gestorClientes.actualizar_cliente(req.body, email);

        console.log(updateCliente);
        res.status(202).json("Cliente modificado.");
    }
    catch(error){
        res.status(500).json({error: error.message });
    }
}); 


routerClientes.post("/registro", async (req, res) => {

    req.body.email = req.body.email.toLowerCase();

    try {
        // Validación
        if (!req.body.nombre || typeof req.body.nombre !== 'string' || req.body.nombre.trim() === '') {
            return res.status(400).json({ message: "Nombre del cliente es requerido" });
        }
        if (!req.body.apellido || typeof req.body.apellido !== 'string' || req.body.apellido.trim() === '') {
            return res.status(400).json({ message: "Apellido del cliente es requerido" });
        }
        if (!req.body.email || typeof req.body.email !== 'string' || req.body.email.trim() === '') {
            return res.status(400).json({ message: "Email del cliente es requerido" });
        }
        if (!req.body.password || typeof req.body.apellido !== 'string' || req.body.apellido.trim() === '') {
            return res.status(400).json({ message: "Password del cliente es requerido" });
        }

        const existingClient = await gestorClientes.obtener_cliente_por_email(req.body.email);
        if (existingClient) {
            return res.status(400).json({ message: "El email ya está registrado." });
        }

        const { password } = req.body;

        req.body.password = await bcrypt.hash(password, 10);
        // Creación del cliente si las validaciones pasan

        const nuevoCliente = await gestorClientes.crear_cliente(req.body);

        res.status(201).json(nuevoCliente);
    } catch (error) {
        res.status(400).json({ error: error.message });
    };
});

routerClientes.post("/login", async (req, res) => {
    try {
        // Obtener el usuario por email
        const usuario = await gestorClientes.obtener_cliente_por_email(req.body.email);

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

