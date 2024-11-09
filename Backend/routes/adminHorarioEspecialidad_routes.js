import pkg from 'express';
const { Router } = pkg;
import { gestorAdminHorarioEspecialidad } from "../index.js";

export const routerAdminHorarioEspecialidad = Router();

// Obtener todos los registros de AdminHorarioEspecialidad
routerAdminHorarioEspecialidad.get("/", async (req, res) => {
    const { dia, especialidad } = req.query;
    const especialidadInt = parseInt(especialidad)
    try {

        // Filtrar horarios en base a los parámetros de día y especialidad
        let datos = await gestorAdminHorarioEspecialidad.obtener_todos();
        console.log(datos)
        if (dia && especialidad){
            datos = datos.filter(horario => horario.dia_semana == dia && horario.id_especialidad == especialidadInt)
        }
        
        if (datos) {
            res.status(200).json(datos);
        } else {
            res.status(500).json("Error!");
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Crear un nuevo registro en AdminHorarioEspecialidad
routerAdminHorarioEspecialidad.post("/", async (req, res) => {
    try {
        const { id_profesional, id_especialidad } = req.body;

        // Validación de campos
        if (!id_profesional || !id_especialidad) {
            return res.status(400).json({ message: "Todos los campos son requeridos: id_profesional, id_especialidad" });
        }

        // Creación del nuevo registro
        const nuevoRegistro = await gestorAdminHorarioEspecialidad.crear_registro(req.body);
        res.status(201).json(nuevoRegistro);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Obtener un registro específico por su ID
routerAdminHorarioEspecialidad.get("/:id", async (req, res) => {
    try {
        const registroId = req.params.id;

        const registro = await gestorAdminHorarioEspecialidad.obtener_por_id(registroId);
        if (!registro) {
            return res.status(404).json({ message: "Registro no encontrado." });
        }

        res.status(200).json(registro);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Obtener registros por ID de estilista
routerAdminHorarioEspecialidad.get("/estilista/:id_profesional", async (req, res) => {
    try {
        const { id_profesional } = req.params;

        const datos = await gestorAdminHorarioEspecialidad.obtener_por_id_profesional(id_profesional);

        if (datos) {
            res.status(200).json(datos);
        } else {
            res.status(404).json({ message: "No se encontraron registros para este estilista" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Actualizar un registro en AdminHorarioEspecialidad
routerAdminHorarioEspecialidad.put("/:id", async (req, res) => {
    try {
        const registroId = req.params.id;
        const { id_profesional, id_especialidad } = req.body;

        // Validación
        if (!id_profesional || !id_especialidad) {
            return res.status(400).json({ message: "Todos los campos son requeridos: id_profesional, id_especialidad" });
        }

        const registroExistente = await gestorAdminHorarioEspecialidad.obtener_por_id(registroId);
        if (!registroExistente) {
            return res.status(404).json({ message: "Registro no encontrado." });
        }

        // Actualización del registro
        await gestorAdminHorarioEspecialidad.actualizar_registro(req.body, registroId);
        res.status(200).json({ message: "Registro actualizado exitosamente" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Eliminar un registro de AdminHorarioEspecialidad
routerAdminHorarioEspecialidad.delete("/:id", async (req, res) => {
    try {
        const registroId = req.params.id;

        const registroExistente = await gestorAdminHorarioEspecialidad.obtener_por_id(registroId);
        if (!registroExistente) {
            return res.status(404).json({ message: "Registro no encontrado." });
        }

        await gestorAdminHorarioEspecialidad.eliminar_registro(registroId);
        res.status(204).json({ message: "Registro eliminado exitosamente" }); // No hay contenido que devolver
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
