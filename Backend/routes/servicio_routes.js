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
})
routerServicios.get("/especialidad/:id", async (req, res) => {
    const id = req.params.id;
    const datos = await gestorServicios.obtener_servicios_por_especialidad(id);
    if (datos) {
        res.status(200).json(datos);
    } else {
        res.status(404).send("Servicio inexistente");
    }
})
routerServicios.get("/:id", async (req, res) => {
    const id = req.params.id;
    const datos = await gestorServicios.obtener_servicio_por_id(id);
    if (datos) {
        res.status(200).json(datos);
    } else {
        res.status(404).send("Servicio inexistente");
    }
})
routerServicios.post("/", async (req, res) => {
    try {
        // Validación
        console.log(req.body)
        if (!req.body.nombre || typeof req.body.nombre !== 'string' || req.body.nombre.trim() === '') {
            return res.status(400).json({ message: "Nombre de servicio es requerido" });
        }
        if (!req.body.precio || typeof req.body.precio !== "string" || req.body.precio.trim() === '') {
            return res.status(400).json({ message: "precio de servicio es requerido" });
        }
        if (!req.body.duracion || typeof req.body.duracion !== 'string' || req.body.duracion.trim() === '') {
            return res.status(400).json({ message: "duracion de servicio es requerido" });
        }
        if (!req.body.id_especialidad || typeof req.body.id_especialidad !== 'string' || req.body.id_especialidad.trim() === '') {
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