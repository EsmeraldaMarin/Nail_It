import { Especialidades } from "../db/especialidad_tabla.js";
import { Servicios } from "../db/servicio_tabla.js";

export class GestorServicios{
    async obtener_servicios(condicion){
        return await Servicios.findAll({
            where: condicion,
            include: [
                {model: Especialidades,
                    key: 'id_especialidad'
                }
            ]
        });
    }

    async crear_servicio(body){
        return await Servicios.create(body);
    }

}

