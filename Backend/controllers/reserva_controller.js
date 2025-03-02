import { Admins } from "../db/admin_tabla.js";
import { Clientes } from "../db/cliente_tabla.js";
import { Reservas } from "../db/reserva_tabla.js";
import { Servicios } from "../db/servicio_tabla.js";
import { Especialidades } from "../db/especialidad_tabla.js";
import enviarNotificacion from "../whatsapp.js";
import { Op } from "sequelize";
import { sequelize } from "../db/database.js";

export class GestorReservas {

    async obtener_reservas(fecha, fechaDesde, fechaHasta, id_profesional, estado) {
        console.log("-----------")
        console.log(fechaDesde, fechaHasta)
        console.log("-----------")
        let condicion = [];

        // 🔹 Filtro por fecha exacta (si se proporciona)
        if (fecha) {
            condicion.push({
                [Op.and]: sequelize.where(sequelize.fn("date", sequelize.col("fecha")), "=", fecha),
            });
        }

        // 🔹 Filtro por rango de fechas (si se proporciona)
        if (fechaDesde && fechaHasta) {
            condicion.push({
                [Op.and]: [
                    sequelize.where(sequelize.fn('DATE', sequelize.col('fecha')), '>=', fechaDesde),
                    sequelize.where(sequelize.fn('DATE', sequelize.col('fecha')), '<=', fechaHasta)
                ]
            });
        }
        
        if (id_profesional) {
            condicion.push({ id_profesional });
        }

        if (estado) {
            condicion.push({ estado });
        }

        try {
            return await Reservas.findAll({
                where: condicion.length > 0 ? { [Op.and]: condicion } : {},
                order: [
                    ["fecha", "ASC"],      // Ordenar por fecha ASC
                    ["horaInicio", "ASC"], // Ordenar por hora de inicio ASC
                ],
                include: [
                    { model: Clientes },
                    {
                        model: Servicios,
                        include: [{ model: Especialidades, as: "Especialidad" }],
                    },
                    { model: Admins }
                ],
            });
        } catch (error) {
            console.error("Error en obtener_reservas:", error);
            throw error;
        }
    }
    // Función para crear una reserva y enviar la notificación
    async crear_reserva(req_body) {
        try {
            // Crear la reserva en la base de datos
            const reserva = await Reservas.create(req_body);

            // Obtener los datos de la estilista
            const estilista = await Admins.findByPk(req_body.id_profesional);
            if (!estilista) {
                throw new Error('Estilista no encontrada.');
            }

            // Obtener los datos del cliente, reserva desde estilista
            let clienteNombre = req_body.nombre_cliente;
            let clienteApellido = req_body.apellido_cliente;

            // Obtener los datos del cliente, reserva desde cliente
            if (req_body.id_cliente) {
                const cliente = await Clientes.findByPk(req_body.id_cliente);
                if (!cliente) {
                    throw new Error('Cliente registrado no encontrado.');
                }
                clienteNombre = cliente.nombre;
                clienteApellido = cliente.apellido;
            }

            // Obtener los datos del servicio
            const servicio = await Servicios.findByPk(req_body.id_servicio);
            if (!servicio) {
                throw new Error('Servicio no encontrado.');
            }

            // Construir el mensaje para la estilista
            const mensaje = `
                Hola ${estilista.nombre}, tienes una nueva reserva pendiente de confirmación.
                Detalles:
                - Cliente: ${clienteNombre} ${clienteApellido || ''}
                - Teléfono: ${req_body.telefono_cliente || 'No disponible'}
                - Fecha: ${req_body.fecha}
                - Hora: ${req_body.horaInicio}
                - Servicio: ${servicio.nombre}
    
                Por favor, revisa tu panel para confirmar.`;

            // Enviar la notificación de WhatsApp
            await enviarNotificacion(estilista.numero, mensaje);

            return reserva; // Devuelve la reserva creada
        } catch (error) {
            console.error('Error en crear_reserva:', error);
            throw error; // Lanzar el error para manejarlo en la ruta
        }
    }


    async obtener_reserva_por_id(id_reserva) {
        return await Reservas.findOne({
            where: { id: id_reserva },
            include: [
                {
                    model: Clientes,   // Incluir el cliente
                },
                {
                    model: Servicios,  // Incluir el servicio
                    include: [{
                        model: Especialidades,
                        as: 'Especialidad',  // Utiliza el alias definido en la relación
                        attributes: ['id', 'nombre', 'descripcion'] // Incluir la especialidad dentro del servicio
                    }]
                },
                {
                    model: Admins,     // Incluir el profesional
                }
            ],
        });
    }
    async obtener_reservas_por_cliente(id_cliente) {
        return await Reservas.findAll({
            where: { id_cliente: id_cliente },
            order: [
                ['fecha', 'DESC'],
                ['horaInicio', 'DESC']],
            include: [
                {
                    model: Clientes,   // Incluir el cliente
                },
                {
                    model: Servicios,  // Incluir el servicio
                    include: [{
                        model: Especialidades,
                        as: 'Especialidad',  // Utiliza el alias definido en la relación
                        attributes: ['id', 'nombre', 'descripcion']  // Incluir la especialidad dentro del servicio
                    }]
                },
                {
                    model: Admins,     // Incluir el profesional
                }
            ],
        });
    }
    async obtener_reservas_por_estado(estado) {
        return await Reservas.findAll({
            where: { estado: estado },
            include: [
                {
                    model: Clientes,   // Incluir el cliente
                },
                {
                    model: Servicios,  // Incluir el servicio
                    include: [{
                        model: Especialidades,
                        as: "Especialidad"  // Incluir la especialidad dentro del servicio
                    }]
                },
                {
                    model: Admins,     // Incluir el profesional
                }
            ],
        });
    }

    async actualizar_reserva(req_body, id_reserva) {
        return await Reservas.update(req_body, {
            where: { id: id_reserva }
        });
    }
    async confirmar_reserva(id_reserva) {

        return await Reservas.update({ estado: 'confirmada' }, {
            where: { id: id_reserva }
        });
    }

    async finalizar_reserva(id_reserva, nuevo_estado) {
        // El nuevo_estado puede tener los valores "realizada" o "no_realizada"
        // Su valor esta determinado por la llegada o no llegada del cliente al turno
        return await Reservas.update({ estado: nuevo_estado }, {
            where: { id: id_reserva }
        });
    }

    //esta accion se realiza cuando una estilista cancela una reserva
    async por_reembolsar_reserva(id_reserva) {

        return await Reservas.update({ estado: 'por_reembolsar' }, {
            where: { id: id_reserva }
        });
    }

    async eliminar_reserva(id) {
        return await Reservas.destroy({
            where: { id: id }
        });
    }
    async cancelar_reservas_pendientes_del_dia(fecha) {
        console.log("Cancelando reservas del día " + fecha);

        const reservas = await Reservas.findAll({
            where: {
                estado: 'pendiente',
                [Op.and]: sequelize.where(sequelize.fn('date', sequelize.col('fecha')), '=', fecha),
            }
        });

        reservas.forEach((reserva) => {
            // TODO: Send email to client

            console.log("Cancelando reserva " + reserva.id);
        });

        await Reservas.update({
            estado: 'cancelada'
        }, {
            where: {
                estado: 'pendiente',
                [Op.and]: sequelize.where(sequelize.fn('date', sequelize.col('fecha')), '=', fecha),
            }
        });

        return true;
    }
}