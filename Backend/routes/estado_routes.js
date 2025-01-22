import pkg from 'express';
const { Router } = pkg;
import { gestorEstados } from "../index.js";


export const routerEstados = Router();

routerEstados.get("/", async (req, res) => {
    const datos = await gestorEstados.obtener_estados();
    if (datos) {
        res.status(200).json(datos);
    } else {
        res.status(400).json("Error!");
    }
})
routerEstados.get("/:id", async (req, res) => {
    const id = req.params.id;
    const datos = await gestorEstados.obtener_estado_por_id(id);
    if (datos) {
        res.status(200).json(datos);
    } else {
        res.status(404).send("Estado inexistente");
    }
})
routerEstados.post("/", async (req, res) => {
    try {
        // Validación
        if (!req.body.nombre || typeof req.body.nombre !== 'string' || req.body.nombre.trim() === '') {
            return res.status(400).json({ message: "Nombre de estado es requerido" });
        }
      
        const estado_existente = await gestorEstados.obtener_estado_por_nombre(req.body.nombre);
        if (estado_existente) {
            return res.status(400).json({ message: "El estado ya está registrado." });
        }

        // Creación de la especialidad. 

        const nuevoEstado = {nombre: req.body.nombre,
                            descripcion: req.body.descripcion
        }

        const nuevoEstadoEnBaseDeDatos = await gestorEstados.crear_estado(nuevoEstado);
        res.status(201).json(nuevoEstado);
    } catch (error) {
        res.status(400).json({ error: error.message });
    };
});

routerEstados.put("/:id", async (req, res) => {
    try {

        const id = req.params.id;

        const estadoExistente = await gestorEstados.obtener_estado_por_id(id)

        if (!estadoExistente) {
            return res.status(401).send("Estado no encontrado");
        }

        const updateEstado = await gestorEstados.actualizar_estado(req.body, id);
        
        res.status(202).json("Estado modificado.");
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});

routerEstados.delete("/:id", async (req, res) => {
    try {
        const id = req.params.id;

        const estadoExistente = await gestorEstados.obtener_estado_por_id(id);

        if (!estadoExistente) {
            return res.status(404).send("Estado no encontrado");
        }

        await gestorEstados.eliminar_estado(id);

        res.status(204).json("Estado borrado exitosamente"); // No hay contenido que devolver
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});