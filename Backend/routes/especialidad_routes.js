import pkg from 'express';
const { Router } = pkg;
import { gestorEspecialidades } from "../index.js";

export const routerEspecialidades = Router();

routerEspecialidades.get("/", async (req, res) => {
    const datos = await gestorEspecialidades.obtener_especialidades();
    if (datos){
        res.status(200).json(datos);
    } else {
        res.status(500).json("Error!");
    }
});

routerEspecialidades.post("/", async (req, res) => {
    try {
        // Validación
        if (!req.body.nombre || typeof req.body.nombre !== 'string' || req.body.nombre.trim() === '') {
            return res.status(400).json({ message: "Nombre de especialidad es requerido" });
        }

        const especialidad_existente = await gestorEspecialidades.obtener_especialidad_por_nombre(req.body.nombre);
        if (especialidad_existente) {
            return res.status(400).json({ message: "La especialidad ya está registrada." });
        }

        // Creación de la especialidad. 

        const nuevaEspecialidad = await gestorEspecialidades.crear_especialidad(req.body);
        res.status(201).json(nuevaEspecialidad);
    } catch (error) {
        res.status(400).json({ error: error.message });
    };
});

routerEspecialidades.put("/:id", async (req, res) => {
    try {
        const especialidadId = req.params.id;

        // Validación
        if (!req.body.nombre || typeof req.body.nombre !== 'string' || req.body.nombre.trim() === '') {
            return res.status(400).json({ message: "Nombre de especialidad es requerido" });
        }

        const especialidad_existente = await gestorEspecialidades.obtener_especialidad_por_id(especialidadId);
        if (!especialidad_existente) {
            return res.status(404).json({ message: "Especialidad no encontrada." });
        }

        // Modificación de la especialidad
        await gestorEspecialidades.actualizar_especialidad(req.body, especialidadId);
        res.status(200).json({message: "Especialidad modificada"});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

routerEspecialidades.get("/:id", async (req, res) => {
    try {
        const especialidadId = req.params.id;

        // Obtener la especialidad por ID
        const especialidad = await gestorEspecialidades.obtener_especialidad_por_id(especialidadId);
        
        if (!especialidad) {
            return res.status(404).json({ message: "Especialidad no encontrada." });
        }

        res.status(200).json(especialidad);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


routerEspecialidades.delete("/:id", async (req, res) => {
    try {
        const especialidadId = req.params.id;

        const especialidad_existente = await gestorEspecialidades.obtener_especialidad_por_id(especialidadId);
        if (!especialidad_existente) {
            return res.status(404).json({ message: "Especialidad no encontrada." });
        }

        const result = await gestorEspecialidades.eliminar_especialidad(especialidadId);

        res.status(204).json({message: "Borrado exitósamente!", result}); // No hay contenido que devolver
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});