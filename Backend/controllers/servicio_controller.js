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
    async obtener_servicios_by_especialidad(id) {
        try{
            return await Servicios.findAll({
                where: { id_especialidad: id },
                include: [
                    {
                        model: Especialidades,
                        key: 'id_especialidad'
                    }
                ]
            });
        } catch(error){
            console.error(error)
        }
    }

    async crear_servicio(body) {
        return await Servicios.create(body);
    }

}

