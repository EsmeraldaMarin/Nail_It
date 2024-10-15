import { Admins } from "../db/admin_tabla.js";
import { Clientes } from "../db/cliente_tabla.js";
import { Reservas } from "../db/reserva_tabla.js";
import { Servicios } from "../db/servicio_tabla.js";
import { Especialidades } from "../db/especialidad_tabla.js";

export class GestorReservas {
    async obtener_reservas(condicion) {
        try {
            return await Reservas.findAll({
                where: condicion,
                order: [
                    ['fecha', 'DESC'],      // Ordenar primero por fecha de manera DESCendente
                    ['horaInicio', 'DESC']  // Ordenar luego por hora de inicio de manera DESCendente
                ],
                include: [
                    {
                        model: Clientes,   // Incluir el cliente
                    },
                    {
                        model: Servicios,  // Incluir el servicio
                        include: [{
                            model: Especialidades,  // Incluir la especialidad dentro del servicio
                        }]
                    },
                    {
                        model: Admins,     // Incluir el profesional
                    }
                ],
            });

        } catch (error) {
            console.error('Error en crear_reserva:', error);
            throw error; // Lanzar el error para manejarlo en la ruta
        }
    }

    async crear_reserva(req_body) {
        try {
            return await Reservas.create(req_body);
        } catch (error) {
            console.error('Error en crear_reserva:', error);
            throw error; // Lanzar el error para manejarlo en la ruta
        }
    }

    async obtener_reservas_por_id(id_reserva) {
        return await Reservas.findAll({
            where: { id: id_reserva },
            include: [
                {
                    model: Clientes,   // Incluir el cliente
                },
                {
                    model: Servicios,  // Incluir el servicio
                    include: [{
                        model: Especialidades,  // Incluir la especialidad dentro del servicio
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
                        model: Especialidades,  // Incluir la especialidad dentro del servicio
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
                        model: Especialidades,  // Incluir la especialidad dentro del servicio
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
        console.log(id_reserva)
        return await Reservas.update({ estado: 'confirmada' }, {
            where: { id: id_reserva }
        });
    }

    async eliminar_reserva(id) {
        return await Reservas.destroy({
            where: { id: id }
        });
    }
}