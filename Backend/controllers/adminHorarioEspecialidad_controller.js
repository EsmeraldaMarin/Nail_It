import { AdminHorarioEspecialidad } from "../db/adminHorarioEspecialidad_tabla.js";

export class GestorAdminHorarioEspecialidad {
    // Obtener todos los registros de AdminHorarioEspecialidad
    async obtener_todos() {
        return await AdminHorarioEspecialidad.findAll();
    }

    // Crear un nuevo registro de AdminHorarioEspecialidad
    async crear_registro(req_body) {
        return await AdminHorarioEspecialidad.create(req_body);
    }

    // Obtener un registro por ID
    async obtener_por_id(id) {
        return await AdminHorarioEspecialidad.findOne({ where: { id: id } });
    }
    // Obtener registros por ID de la estilista
    async obtener_por_id_profesional(id_profesional) {
        return await AdminHorarioEspecialidad.findAll({ where: { id_profesional: id_profesional } });
    }

    // Actualizar un registro de AdminHorarioEspecialidad
    async actualizar_registro(req_body, id) {
        return await AdminHorarioEspecialidad.update(req_body, {
            where: { id: id }
        });
    }

    // Eliminar un registro de AdminHorarioEspecialidad
    async eliminar_registro(id) {
        return await AdminHorarioEspecialidad.destroy({
            where: { id: id }
        });
    }
}
