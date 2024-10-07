import { Admins } from "../db/admin_tabla.js";
import { Clientes } from "../db/cliente_tabla.js";
import { Reservas } from "../db/reserva_tabla.js";
import { Servicios } from "../db/servicio_tabla.js";


export class GestorReservas {
    async obtener_reservas(condicion) {
        try {
            return await Reservas.findAll({
                where: condicion,
                include: [
                    {
                        model: Clientes,
                        key: 'id_cliente'
                    }, {
                        model: Servicios,
                        key: 'id_servicio'
                    }, {
                        model: Admins,
                        key: 'id_profesional'
                    }
                ]
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


    async obtener_reservas_por_estado(estado) {
        return await Reservas.findOne({ where: { estado: estado } });
    }

    async actualizar_reserva(req_body, id_reserva) {
        return await Reservas.update(req_body, {
            where: { id: id_reserva }
        });
    }
    async confirmar_reserva(id_reserva) {
        console.log(id_reserva)
        return await Reservas.update({estado: 'confirmada'}, {
            where: { id: id_reserva }
        });
    }

    async eliminar_reserva(id) {
        return await Reservas.destroy({
            where: { id: id }
        });
    }
}