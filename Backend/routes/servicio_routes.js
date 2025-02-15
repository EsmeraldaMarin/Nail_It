import pkg from 'express';
const { Router } = pkg;
import { gestorServicios } from "../index.js";


export const routerServicios = Router();

routerServicios.get("/", async (req, res) => {
    const datos = await gestorServicios.obtener_servicios();
    if (datos) {
        res.status(200).json(datos);
    } else {
        res.status(400).json("Error!");
    }
});

routerServicios.get("/especialidad/:id", async (req, res) => {
    const id = req.params.id;
    const datos = await gestorServicios.obtener_servicios_por_especialidad(id);
    if (datos) {
        res.status(200).json(datos);
    } else {
        res.status(404).send("Servicio inexistente");
    }
});

routerServicios.get("/:id", async (req, res) => {
    const id = req.params.id;
    const datos = await gestorServicios.obtener_servicio_por_id(id);
    if (datos) {
        res.status(200).json(datos);
    } else {
        res.status(404).send("Servicio inexistente");
    }
});

routerServicios.post("/", async (req, res) => {
    try {
        // Validación
        if (!req.body.nombre || typeof req.body.nombre !== 'string' || req.body.nombre.trim() === '') {
            return res.status(400).json({ message: "Nombre de servicio es requerido" });
        }
        if (!req.body.precio || typeof req.body.precio !== "number") {
            return res.status(400).json({ message: "precio de servicio es requerido" });
        }
        if (!req.body.duracion || typeof req.body.duracion !== "number") {
            return res.status(400).json({ message: "duracion de servicio es requerido" });
        }
        if (!req.body.id_especialidad || typeof req.body.id_especialidad !== "number") {
            return res.status(400).json({ message: "id_especialidad de servicio es requerido" });
        }

        const servicio_existente = await gestorServicios.obtener_servicio_por_nombre(req.body.nombre);
        if (servicio_existente) {
            return res.status(400).json({ message: "El servicio ya está registrado." });
        }

        // Creación de la especialidad. 

        const nuevoServicio = await gestorServicios.crear_servicio(req.body);
        res.status(201).json(nuevoServicio);
    } catch (error) {
        res.status(400).json({ error: error.message });
    };
});

routerServicios.delete("/:id", async (req, res) => {
    try {
        const servicioId = req.params.id;

        // Verificar si el servicio existe
        const servicio_existente = await gestorServicios.obtener_servicio_por_id(servicioId);
        if (!servicio_existente) {
            return res.status(404).json({ message: "Servicio no encontrado." });
        }

        // Eliminar el servicio
        await gestorServicios.eliminar_servicio(servicioId);

        res.status(204).json(); // No hay contenido que devolver
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

routerServicios.put("/:id", async (req, res) => {
    try {
        const servicioId = req.params.id;

        // Validación
        if (!req.body.nombre || typeof req.body.nombre !== 'string' || req.body.nombre.trim() === '') {
            return res.status(400).json({ message: "Nombre de servicio es requerido" });
        }
        if (!req.body.precio || typeof req.body.precio !== "number") {
            return res.status(400).json({ message: "Precio de servicio es requerido" });
        }
        if (!req.body.duracion || typeof req.body.duracion !== 'number') {
            return res.status(400).json({ message: "Duración de servicio es requerida" });
        }
        if (!req.body.id_especialidad || typeof req.body.id_especialidad !== 'number') {
            return res.status(400).json({ message: "ID de especialidad de servicio es requerido" });
        }

        // Verificar si el servicio existe
        const servicio_existente = await gestorServicios.obtener_servicio_por_id(servicioId);
        if (!servicio_existente) {
            return res.status(404).json({ message: "Servicio no encontrado." });
        }

        // Modificación del servicio
        const servicioModificado = await gestorServicios.actualizar_servicio(req.body, servicioId);
        res.status(200).json({ message: "Servicio modificado!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

routerServicios.put("/:id/cambioEstado", async (req, res) => {
    try {
        const { id } = req.params;
        const { esta_activo } = req.body;
        if (!id || esta_activo === null || esta_activo === undefined || esta_activo === "") {
            return res.status(400).json({ message: "Faltan parametros para realizar la operacion" });
        }

        // Verificar si el servicio existe
        const servicio_existente = await gestorServicios.obtener_servicio_por_id(id);
        if (!servicio_existente) {
            return res.status(404).json({ message: "Servicio no encontrado." });
        }
        const servicioModificado = await gestorServicios.modificar_estado_servicio(esta_activo, id);
        res.json({ message: "Servicio desactivado con éxito"});

    } catch (error) {
        res.status(500).json({ message: "Error al desactivar el servicio", error: error.message });
    }
});

