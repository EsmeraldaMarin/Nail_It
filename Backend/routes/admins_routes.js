import pkg from "express";
const { Router } = pkg
import { gestorAdmins, gestorClientes } from "../index.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { GestorAdmins } from "../controllers/admin_controller.js";
import { enviarMailVerificacion, enviarMailVerificacionAdmin } from "../controllers/services/mail.services.js";

export const routerAdmins = Router();

routerAdmins.get("/", async (req, res) => {
    const datos = await gestorAdmins.obtener_admins();
    if (datos) {
        res.status(200).json(datos);
    } else {
        res.status(500).send("Error!")
    }
})

routerAdmins.get("/:id", async (req, res) => {
    const id = req.params.id;
    const datos = await gestorAdmins.obtener_admin(id);
    if (datos) {
        res.status(200).json(datos);
    } else {
        res.status(404).send("Admin inexistente");
    }
});

routerAdmins.post("/registro", async (req, res) => {
    req.body.email = req.body.email.toLowerCase();
    try {
        // Validación
        if (!req.body.nombre || typeof req.body.nombre !== 'string' || req.body.nombre.trim() === '') {
            return res.status(400).json({ message: "Nombre del admin es requerido" });
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

        const existingUser = await gestorAdmins.obtener_admin_por_email(req.body.email) || await gestorClientes.obtener_cliente_por_email(req.body.email);
        if (existingUser) {
            return res.status(409).json({
                status: 409,
                error: "Conflict",
                message: "Ya existe un usuario registrado con ese email"
            });
        }

        const { password } = req.body;
        req.body.password = await bcrypt.hash(password, 10);

        const tokenVerificacion = jwt.sign(
            { user: req.body.email },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRATION }
        )

        const mail = await enviarMailVerificacionAdmin(req.body.email, tokenVerificacion);
        if (mail.accepted === 0) {
            return res.status(500).send({ status: "error", message: "Error enviando mail de verificación" })
        }

        const nuevoAdmin = {
            nombre: req.body.nombre,
            apellido: req.body.apellido,
            email: req.body.email,
            numero: req.body.numero,
            password: req.body.password,
            mustChangePassword: 1,
            verificado: 0
        };

        const nuevoAd = await gestorAdmins.crear_admin(nuevoAdmin);

        res.status(201).json(nuevoAd);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
})

routerAdmins.post("/login", async (req, res) => {
    try {
        // Obtener el usuario por email
        const usuario = await gestorAdmins.obtener_admin_por_email(req.body.email);

        // // Verificar si el usuario existe
        // if (!usuario || !usuario.verificado) {
        //     return res.status(400).json({ message: "Email no registrado o no verificado." });
        // }

        // // Verificar si el usuario existe
        if (!usuario) {
            return res.status(400).json({ message: "Email no registrado" });
        }

        // Comparar la contraseña
        const passwordMatch = await bcrypt.compare(req.body.password, usuario.password);
        if (!passwordMatch) {
            return res.status(400).json({ message: "Contraseña incorrecta." });
        }

        const payload = {
            usuario: {
                id: usuario.id,
                nombre: usuario.nombre,
                email: usuario.email,
                isAdmin: true
            }
        };
        // Si las credenciales son válidas, puedes generar un token aquí

        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRATION });
        const cookieOption = {
            expiresIn: process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 100,
            path: "/"
        }
        let debeCambiarContra = false;
        if (usuario.mustChangePassword) {
            debeCambiarContra = true
        }

        res.cookie("jwt", token, cookieOption);
        // Responder con el token y un mensaje de éxito
        res.status(200).json({
            mustChangePassword: debeCambiarContra,
            token,
            usuario: {
                id: usuario.id,
                email: usuario.email,
                nombre: usuario.nombre,
                isAdmin: usuario.isAdmin
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

routerAdmins.put("/:id", async (req, res) => {
    try {
        const id = req.params.id.toLowerCase();

        const adminExistente = await gestorAdmins.obtener_admin(id);
        if (!adminExistente) {
            return res.status(401).send("Administrador no encontrado");
        }

        const { password } = req.body;
        let token;
        // Si se proporciona una nueva contraseña, la hasheamos
        if (password) {
            const payload = {
                usuario: {
                    id: adminExistente.id,
                    nombre: adminExistente.nombre,
                    email: adminExistente.email,
                    isAdmin: true,
                }
            };
            req.body.password = await bcrypt.hash(password, 10);
            token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRATION });
            req.body.mustChangePassword = false;
        }

        await gestorAdmins.actualizar_admin_por_id(req.body, id);
        res.status(202).json({
            token,
            message: "Admin cambiado exitosamente"
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

routerAdmins.delete("/:id", async (req, res) => {
    const adminId = req.params.id;

    try {
        const resultado = await gestorAdmins.eliminar_admin(adminId);

        if (resultado) {
            res.status(200).json({ message: "Administrador eliminado con éxito" });
        } else {
            res.status(404).send("Administrador no encontrado");
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Error al eliminar el administrador");
    }
});

routerAdmins.post("/:id/change_password", async(req, res) => {
    try {
        const old_password = req.body.password;
        const password_confirmation = req.body.password_confirmation;
        let new_password = req.body.new_password;

        // TODO: Pass token header instead of req object
        // TODO: Move to generic place.
        // TODO: Create enum/const for status codes
        // Move: Logic to services and call it from the controller
        const get_jwt_data = (req) => {
            let authorization_header = req.headers.authorization ?? "";
            authorization_header = authorization_header.split(' ');

            if(!authorization_header || authorization_header.length < 2) {
                return undefined;
            }

            const token = authorization_header[1] ?? ""; // Header Authorization: Beaber {jwt}

            try {
                return jwt.verify(token, process.env.JWT_SECRET, (error, payload) => {
                    if(error) {
                        console.error(error);
                        return undefined;
                    }

                    return payload;
                });
            }
            catch(error) {
                console.error(error);
                return undefined;
            }
        };

        const jwt_payload = get_jwt_data(req);

        if(!jwt_payload) {
            return res.status(403).json({message: "Invalid authorization token"});
        }

        const admin = await gestorAdmins.obtener_admin(jwt_payload?.usuario?.id);

        if(!admin) {
            return res.status(404).json({message: "Resource not found"});
        }

        if(!new_password) {
            return res.status(400).json({message: "Missing new password"});
        }

        if(!password_confirmation || new_password != password_confirmation) {
            return res.status(400).json({ message: "Invalid password_confirmation" });
        }

        const password_match = await bcrypt.compare(old_password, admin.password);

        if (!password_match) {
            return res.status(403).json({ message: "Invalid password" });
        }

        if(new_password == old_password) {
            return res.status(400).json({ message: "New password cannot be the same as current password" });
        }

        new_password = await bcrypt.hash(new_password, 10);
        await gestorAdmins.change_password(admin.id, new_password);

        res.status(200).json({message: "OK"});
    }
    catch(error) {
        console.error(error);
        res.status(500).json({message: "Internal server error"});
    }
});