import pkg from 'express';
const { Router } = pkg;
import { gestorReservas } from "../index.js";

export const routerReservas = Router();

routerReservas.get("/", async (req, res) => {
    const datos = await gestorReservas.obtener_reservas();
    if (datos) {
        res.status(200).json(datos);
    } else {
        res.status(500).json("Error!");
    }
});

routerReservas.post("/confirmar/:id", async (req, res) => {
    try {
        const id = req.params.id;
        console.log(req.params)
        const reservaActualizada = await gestorReservas.confirmar_reserva(id);
        console.log(reservaActualizada)
        res.status(201).json(reservaActualizada);
    } catch (error) {
        res.status(400).json({ error: error.message });
    };
});

routerReservas.post("/", async (req, res) => {
    try {
        console.log(req.body)
        if (!req.body.horaInicio || typeof req.body.horaInicio !== 'string' || req.body.horaInicio.trim() === '') {
            return res.status(400).json({ message: "horaInicio de especialidad es requerido" });
        }
        if (!req.body.comprobante || typeof req.body.comprobante !== 'string' || req.body.comprobante.trim() === '') {
            return res.status(400).json({ message: "comprobante de especialidad es requerido" });
        }
        if (!req.body.estado || typeof req.body.estado !== 'string' || req.body.estado.trim() === '') {
            return res.status(400).json({ message: "estado de especialidad es requerido" });
        }
        if (!req.body.id_servicio || typeof req.body.id_servicio !== 'string' || req.body.id_servicio.trim() === '') {
            return res.status(400).json({ message: "id_servicio de especialidad es requerido" });
        }

        const nuevaReserva = await gestorReservas.crear_reserva(req.body);
        res.status(201).json(nuevaReserva);
    } catch (error) {
        res.status(400).json({ error: error.message });
    };
});