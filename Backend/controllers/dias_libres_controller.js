import { Dias_libres } from "../db/dias_libres.js";

export class GestorDiasLibres {
    // Obtener todos los días libres
    async obtener_dias_libres(id_admin) {

        let condicion = [];
        id_admin && condicion.push({ id_admin: `${id_admin}` })

        try {
            return await Dias_libres.findAll({
                where: condicion
            });
        } catch (err) {
            console.error("Error al obtener días libres:", err);
            throw new Error("No se pudieron obtener los días libres.");
        }
    }

    // Crear un nuevo día libre
    async crear_dia_libre(req_body) {
        try {
            const { id_admin, fecha_Desde, fecha_Hasta } = req_body;

            // Validación de fechas
            if (new Date(fecha_Desde) > new Date(fecha_Hasta)) {
                throw new Error("La fecha de inicio no puede ser posterior a la fecha de fin.");
            }

            return await Dias_libres.create(req_body);
        } catch (err) {
            console.error("Error al crear día libre:", err);
            throw new Error("No se pudo crear el día libre.");
        }
    }

    // Obtener días libres por ID
    async obtener_diaslibres_por_id(id) {
        try {
            const diaLibre = await Dias_libres.findOne({ where: { id: id } });
            if (!diaLibre) {
                throw new Error("Día libre no encontrado.");
            }
            return diaLibre;
        } catch (err) {
            console.error("Error al obtener día libre:", err);
            throw new Error("No se pudo obtener el día libre.");
        }
    }

    // Actualizar días libres por ID
    async actualizar_diaslibres_por_id(req_body, id) {
        try {
            const { fecha_Desde, fecha_Hasta } = req_body;

            // Validación de fechas
            if (new Date(fecha_Desde) > new Date(fecha_Hasta)) {
                throw new Error("La fecha de inicio no puede ser posterior a la fecha de fin.");
            }

            const [updated] = await Dias_libres.update(req_body, {
                where: { id: id }
            });

            if (updated) {
                return await Dias_libres.findOne({ where: { id: id } });
            } else {
                throw new Error("No se pudo actualizar el día libre.");
            }
        } catch (err) {
            console.error("Error al actualizar día libre:", err);
            throw new Error("No se pudo actualizar el día libre.");
        }
    }

    // Eliminar un día libre por ID
    async eliminar_diaslibres(id) {
        try {
            const deleted = await Dias_libres.destroy({
                where: { id: id }
            });

            if (!deleted) {
                throw new Error("No se pudo eliminar el día libre.");
            }

            return { message: "Día libre eliminado exitosamente." };
        } catch (err) {
            console.error("Error al eliminar día libre:", err);
            throw new Error("No se pudo eliminar el día libre.");
        }
    }

    async verificarDisponibilidad(turnoFecha, id_admin) {
        try {
            // Buscar los días libres del administrador con el id dado
            const diasLibres = await Dias_libres.findAll({
                where: {
                    id_admin: id_admin
                }
            });

            // Verificar si alguna de las fechas de días libres se solapa con la fecha del turno
            for (const diaLibre of diasLibres) {
                const fechaDesde = new Date(diaLibre.fecha_Desde);
                const fechaHasta = new Date(diaLibre.fecha_Hasta);
                const fechaTurno = new Date(turnoFecha);

                // Si la fecha del turno cae dentro del rango de días libres, devolver false
                if (fechaTurno >= fechaDesde && fechaTurno <= fechaHasta) {
                    return false; // No disponible, está en los días libres
                }
            }

            // Si no se solapa, devolver true
            return true;
        } catch (err) {
            console.error("Error al verificar disponibilidad:", err);
            throw new Error("Error al verificar la disponibilidad.");
        }
    }

}