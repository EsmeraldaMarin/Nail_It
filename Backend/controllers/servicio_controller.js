import { where } from "sequelize";
import { Especialidades } from "../db/especialidad_tabla.js";
import { Servicios } from "../db/servicio_tabla.js";

export class GestorServicios {
    async obtener_servicios(condicion) {
        return await Servicios.findAll({
            where: condicion,
            include: [
                {
                    model: Especialidades,
                    key: 'id_especialidad'
                }
            ]
        });
    }
    async obtener_servicios_por_especialidad(id_especialidad) {
        try {
            return await Servicios.findAll({
                where: { id_especialidad: id_especialidad },
                include: [
                    {
                        model: Especialidades,
                        as: 'Especialidad',  // Utiliza el alias definido en la relación
                        attributes: ['id', 'nombre', 'descripcion']  // Especifica los atributos que quieres incluir
                    }
                ]
            });
        } catch (error) {
            console.error(error)
        }
    }

    async obtener_servicio_por_id(id) {
        try {
            return await Servicios.findOne({
                where: { id: id },
                include: [
                    {
                        model: Especialidades,
                        as: 'Especialidad',  // Utiliza el alias definido en la relación
                        attributes: ['id', 'nombre', 'descripcion']  // Especifica los atributos que quieres incluir
                    }
                ]
            });
        } catch (error) {
            console.error(error);
        }
    }
    async crear_servicio(body) {
        return await Servicios.create(body);
    }

    async obtener_servicio_por_nombre(nombre) {
        try {
            return await Servicios.findOne({ where: { nombre: nombre } });
        } catch (error) {
            console.error(error);
        }
    }

    async actualizar_servicio(body, id) {
        return await Servicios.update(body, {
            where: { id: id }
        })
    }

    async eliminar_servicio(id) {
        return await Servicios.destroy({
            where: { id: id }
        })
    }

}

