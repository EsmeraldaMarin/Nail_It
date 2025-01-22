import { Admins } from "../db/admin_tabla.js";
import { Clientes } from "../db/cliente_tabla.js";
import { Reservas } from "../db/reserva_tabla.js";
import { Servicios } from "../db/servicio_tabla.js";
import { Especialidades } from "../db/especialidad_tabla.js";
import enviarNotificacion from "../whatsapp.js";

export class GestorReservas {
    async obtener_reservas(fecha, id_profesional) {
        let condicion = [];
        fecha && condicion.push({ fecha: `${fecha}` })
        id_profesional && condicion.push({ id_profesional: `${id_profesional}` })

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
                            model: Especialidades,
                            as: "Especialidad"  // Incluir la especialidad dentro del servicio
                        }]
                    },
                    {
                        model: Admins,     // Incluir el profesional
                    }
                ],
            });

        } catch (error) {
            console.error('Error en obtener_reservas:', error);
            throw error; // Lanzar el error para manejarlo en la ruta
        }
    }
    /*
        async crear_reserva(req_body) {
            try {
                return await Reservas.create(req_body);
                
            } catch (error) {
                console.error('Error en crear_reserva:', error);
                throw error; // Lanzar el error para manejarlo en la ruta
            }
        }
    */
    // Función para crear una reserva y enviar la notificación
    async crear_reserva(req_body) {
        try {
            // Crear la reserva en la base de datos
            const reserva = await Reservas.create(req_body);

            // Obtener los datos de la estilista (simulado, ajústalo a tu lógica)
            const estilista = await Admins.findByPk(req_body.id_profesional); 
            const cliente = await Clientes.findByPk(req_body.id_cliente); 
            const servicio = await Servicios.findByPk(req_body.id_servicio); 

            if (!estilista) {
                throw new Error('Estilista no encontrada.');
            }

            // Construir el mensaje para la estilista
            const mensaje = `
                Hola ${estilista.nombre}, tienes una nueva reserva pendiente de confirmación.
                Detalles:
                - Cliente: ${cliente.nombre}
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

    async eliminar_reserva(id) {
        return await Reservas.destroy({
            where: { id: id }
        });
    }
}