import { Reservas } from "../db/reserva_tabla.js";


export class GestorReservas {
    async obtener_reservas() {
        return await Reservas.findAll();
    }

    async crear_reserva(req_body) {
        try {
            return await Reservas.create(req_body);
        } catch (error) {
            console.error('Error en crear_reserva:', error);
            throw error; // Lanzar el error para manejarlo en la ruta
        }
    }


    async obtener_reserva_por_estado(estado) {
        return await Reservas.findOne({ where: { estado: estado } });
    }

    async actualizar_reserva(req_body, nombre) {
        return await Reservas.update(req_body, {
            where: { nombre: nombre }
        });
    }

    async eliminar_reserva(id) {
        return await Reservas.destroy({
            where: { id: id }
        });
    }
}