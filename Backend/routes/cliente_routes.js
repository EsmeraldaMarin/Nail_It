import pkg from "express";
const { Router } = pkg
import { gestorClientes } from "../index.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { Clientes } from "../db/cliente_tabla.js";
import { enviarMailVerificacion } from "../controllers/services/mail.services.js";
import dotenv from "dotenv";

dotenv.config();

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
        res.status(200).json(datos);
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

/* routerClientes.put("/cliente/:email", async (req, res) => {
    try {

        const email = req.params.email.toLowerCase();

        const clienteExistente = await gestorClientes.obtener_cliente_por_email(email);

        console.log(email + " : " + clienteExistente);

        if (!clienteExistente) {
            return res.status(401).send("Cliente no encontrado");
        }

        const { password } = req.body;

        req.body.password = await bcrypt.hash(password, 10);

        const updateCliente = await gestorClientes.actualizar_cliente(req.body, email);

        console.log(updateCliente);
        res.status(202).json("Cliente modificado.");
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}); */

routerClientes.put("/cliente/:id", async (req, res) => {
    try {
        const clienteId = req.params.id;

        const clienteExistente = await gestorClientes.obtener_cliente(clienteId);

        console.log(clienteId + " : " + clienteExistente);

        if (!clienteExistente) {
            return res.status(404).send("Cliente no encontrado");
        }

        const { password } = req.body;

        // Si se proporciona una nueva contraseña, la hasheamos
        if (password) {
            req.body.password = await bcrypt.hash(password, 10);
        }

        const updateCliente = await gestorClientes.actualizar_cliente(req.body, clienteId);

        console.log(updateCliente);
        res.status(202).json("Cliente modificado.");
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

routerClientes.delete("/cliente/:id", async (req, res) => {
    try {
        const clienteId = req.params.id;

        const clienteExistente = await gestorClientes.obtener_cliente(clienteId);

        if (!clienteExistente) {
            return res.status(404).send("Cliente no encontrado");
        }

        await gestorClientes.eliminar_cliente(clienteId);

        res.status(204).json("Cliente removido."); // No hay contenido que devolver
    } catch (error) {
        res.status(500).json({ error: error.message });
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
        if (!req.body.password || typeof req.body.password !== 'string' || req.body.password.trim() === '') {
            return res.status(400).json({ message: "Password del cliente es requerido" });
        }

        const clienteARevisar = await gestorClientes.obtener_cliente_por_email(req.body.email);
        if (clienteARevisar) {
            return res.status(400).json({ message: "El email ya está registrado." })
        }

        const { password } = req.body;
        req.body.password = await bcrypt.hash(password, 10);

        // Validación del email
        const tokenVerificacion = jwt.sign(
            { user: req.body.email },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRATION }
        )

        const mail = await enviarMailVerificacion(req.body.email, tokenVerificacion);
        console.log(mail);
        if (mail.accepted === 0) {
            return res.status(500).send({ status: "error", message: "Error enviando mail de verificación" })
        }

        const nuevoUsuario = {
            nombre: req.body.nombre,
            apellido: req.body.apellido,
            email: req.body.email,
            numero: req.body.numero,
            password: req.body.password,
            verificado: 0
        };


        const nuevoCliente = await gestorClientes.crear_cliente(nuevoUsuario);

        res.status(201).json(nuevoCliente);
    } catch (error) {
        res.status(400).json({ error: error.message });
    };
});

routerClientes.post("/login", async (req, res) => {
    try {
        // Obtener el usuario por email
        const usuario = await gestorClientes.obtener_cliente_por_email(req.body.email);
        console.log(usuario)
        // Verificar si el usuario existe
        // if (!usuario || !usuario.verificado) {
        //     return res.status(400).json({ message: "Email no registrado o no verificado." });
        // }

        // Comparar la contraseña
        const passwordMatch = await bcrypt.compare(req.body.password, usuario.password);
        if (!passwordMatch) {
            return res.status(400).json({ message: "Contraseña incorrecta." });
        }

        const payload = {
            usuario: {
                id: usuario.id,
                email: usuario.email,
                isAdmin: false
            }
        };
        // Si las credenciales son válidas, puedes generar un token aquí

        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRATION });
        const cookieOption = {
            expiresIn: process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 100,
            path: "/"
        }

        res.cookie("jwt", token, cookieOption);
        // Responder con el token y un mensaje de éxito
        res.json({
            token,
            usuario: {
                id: usuario.id,
                email: usuario.email,
                isAdmin: usuario.isAdmin
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Cierre de sesión, hay que testearlo con el front.

routerClientes.post("/logout", async (req, res) => {
    res.clearCookie(req.body.mail);

    res.status(200).json({ message: "Sesión cerrada exitosamente!", redirect: "/inicio" });
})
