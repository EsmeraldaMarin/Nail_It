import { AdminHorarioEspecialidad } from "../db/adminHorarioEspecialidad_tabla.js";
import { Especialidades } from "../db/especialidad_tabla.js";
export class GestorAdminHorarioEspecialidad {
    // Obtener todos los registros de AdminHorarioEspecialidad
    async obtener_todos() {
        return await AdminHorarioEspecialidad.findAll({
            include: [
                {
                    model: Especialidades,
                    as: 'Especialidad',  // Utiliza el alias definido en la relación
                    attributes: ['id', 'nombre', 'descripcion']  // Especifica los atributos que quieres incluir
                }
            ]
        });
    }

    // Crear un nuevo registro de AdminHorarioEspecialidad
    async crear_registro(req_body) {
        try {
            // Crear el nuevo registro
            const nuevoRegistro = await AdminHorarioEspecialidad.create(req_body);

            // Buscar el registro creado y obtener la especialidad relacionada
            const registroConEspecialidad = await AdminHorarioEspecialidad.findOne({
                where: { id: nuevoRegistro.id },
                include: [{
                    model: Especialidades, // Asegúrate de que hayas definido la relación
                    as: 'Especialidad',  // Utiliza el alias definido en la relación
                    attributes: ['id', 'nombre', 'descripcion'],  // Especifica los atributos que quieres incluir
                    required: false // Esto es opcional, dependiendo de si quieres incluir resultados sin especialidades
                }]
            });

            return registroConEspecialidad; // Retornar el registro con la especialidad
        } catch (error) {
            console.error("Error al crear el registro:", error);
            throw error; // Manejo de errores
        }
    }

    // Obtener un registro por ID
    async obtener_por_id(id) {
        return await AdminHorarioEspecialidad.findOne({
            where: { id: id },
            include: [
                {
                    model: Especialidades,
                    as: 'Especialidad',  // Utiliza el alias definido en la relación
                    attributes: ['id', 'nombre', 'descripcion']  // Especifica los atributos que quieres incluir
                }
            ]
        });
    }
    // Obtener registros por ID de la estilista
    async obtener_por_id_profesional(id_profesional) {
        return await AdminHorarioEspecialidad.findAll({
            where: { id_profesional: id_profesional },
            include: [
                {
                    model: Especialidades,
                    as: 'Especialidad',  // Utiliza el alias definido en la relación
                    attributes: ['id', 'nombre', 'descripcion']  // Especifica los atributos que quieres incluir
                }
            ],
            order: [
                ['hora_inicio', 'ASC']],
        });
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
