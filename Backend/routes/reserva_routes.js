import pkg from 'express';
const { Router } = pkg;
import { gestorReservas } from "../index.js";
import { Reservas } from '../db/reserva_tabla.js';

export const routerReservas = Router();

routerReservas.get("/", async (req, res) => {
    const { fecha, fecha_desde, fecha_hasta, id_profesional, estado } = req.query;

    try {
        const datos = await gestorReservas.obtener_reservas(fecha, fecha_desde, fecha_hasta, id_profesional, estado);
        console.log("-----------")
        if (fecha_desde) { console.log(datos) }
        console.log("-----------")

        res.status(200).json(datos);
    } catch (error) {
        console.error("Error al obtener reservas:", error);
        res.status(500).json({ error: "Error al obtener las reservas" });
    }
});

routerReservas.get("/:id", async (req, res) => {
    try {
        const id_reserva = req.params.id;

        // Obtener la reserva por ID
        const reserva = await gestorReservas.obtener_reserva_por_id(id_reserva);

        if (!reserva) {
            return res.status(404).json({ message: "reserva no encontrada." });
        }

        res.status(200).json(reserva);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
routerReservas.get("/user/:id", async (req, res) => {
    try {
        const id_cliente = req.params.id;

        // Obtener la reserva por ID
        const reserva = await gestorReservas.obtener_reservas_por_cliente(id_cliente);

        if (!reserva) {
            return res.status(404).json({ message: "reserva no encontrada." });
        }

        res.status(200).json(reserva);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
routerReservas.post("/finalizar/:id", async (req, res) => {
    try {
        const id = req.params.id;
        await gestorReservas.finalizar_reserva(id, req.body.estado);
        const reservaActualizada = await gestorReservas.obtener_reserva_por_id(id);
        res.status(201).json(reservaActualizada);
    } catch (error) {
        res.status(400).json({ error: error.message });
    };
});
routerReservas.post("/confirmar/:id", async (req, res) => {
    try {
        const id = req.params.id;
        await gestorReservas.confirmar_reserva(id);
        const reservaActualizada = await gestorReservas.obtener_reserva_por_id(id);
        res.status(201).json(reservaActualizada);
    } catch (error) {
        res.status(400).json({ error: error.message });
    };
});

//esta cancelacion se usa solo en la cancelacion desde estilista
//en la cancelacion desde cliente se usa la ruta put
routerReservas.post("/por_reembolsar/:id", async (req, res) => {
    try {
        const id = req.params.id;
        await gestorReservas.por_reembolsar_reserva(id);
        const reservaActualizada = await gestorReservas.obtener_reserva_por_id(id);
        res.status(201).json(reservaActualizada);
    } catch (error) {
        res.status(400).json({ error: error.message });
    };
});

routerReservas.post("/", async (req, res) => {
    try {
        const {
            horaInicio,
            fecha,
            comprobante,
            montoSenia,
            montoTotal,
            id_cliente,
            id_servicio,
            id_profesional,
            estado
        } = req.body;

        // Validaciones generales
        if (!horaInicio || typeof horaInicio !== 'string' || horaInicio.trim() === '') {
            return res.status(400).json({ message: "horaInicio de reserva es requerido" });
        }
        if (!fecha || typeof fecha !== 'string' || fecha.trim() === '') {
            return res.status(400).json({ message: "fecha de reserva es requerida" });
        }
        if (!id_servicio || typeof id_servicio !== 'string' || id_servicio.trim() === '') {
            return res.status(400).json({ message: "id_servicio de reserva es requerido" });
        }
        if (!id_profesional || typeof id_profesional !== 'string' || id_profesional.trim() === '') {
            return res.status(400).json({ message: "id_profesional de reserva es requerido" });
        }

        // Validación específica para cliente registrado o manual
        let reservaData = {
            horaInicio,
            fecha,
            comprobante: comprobante || null,
            montoSenia,
            montoTotal,
            id_servicio,
            id_profesional,
            estado: estado || 'pendiente'
        };
        if (typeof id_cliente === 'number' || typeof id_cliente === 'string') {
            // Cliente registrado
            reservaData.id_cliente = id_cliente;
        } else if (typeof id_cliente === 'object' && id_cliente.nombre_cliente && id_cliente.apellido_cliente && id_cliente.telefono_cliente) {
            // Cliente manual (datos proporcionados por la estilista)
            reservaData.nombre_cliente = id_cliente.nombre_cliente;
            reservaData.apellido_cliente = id_cliente.apellido_cliente;
            reservaData.telefono_cliente = id_cliente.telefono_cliente;
        } else {
            return res.status(400).json({ message: "Debes proporcionar un cliente registrado o los datos de un cliente manual válidos." });
        }

        // Crear la reserva
        const nuevaReserva = await gestorReservas.crear_reserva(reservaData);
        res.status(201).json(nuevaReserva);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});


routerReservas.delete("/:id", async (req, res) => {
    try {
        const reservaId = req.params.id;

        const reserva_existente = await gestorReservas.obtener_reserva_por_id(reservaId);
        if (!reserva_existente) {
            return res.status(404).json({ message: "Reserva no encontrada." });
        }

        await gestorReservas.eliminar_reserva(reservaId);

        res.status(204).json(); // No hay contenido que devolver
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

routerReservas.put("/:id", async (req, res) => {
    try {
        const reservaId = req.params.id;

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
        const reserva_existente = await gestorReservas.obtener_reserva_por_id(reservaId);
        if (!reserva_existente) {
            return res.status(404).json({ message: "Servicio no encontrado." });
        }

        const Modificado = await gestorReservas.actualizar_reserva(req.body, reservaId);
        res.status(200).json({ message: "Reserva modificado!" });


    } catch (error) {
        res.status(400).json({ error: error.message });

    }

})
