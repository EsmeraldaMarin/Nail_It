import { Especialidades } from "../db/especialidad_tabla.js";


export class GestorEspecialidades{
    async obtener_especialidades(){
        return await Especialidades.findAll();
    }

    async crear_especialidad(req_body){
        return await Especialidades.create(req_body);
    }

    async obtener_especialidad_por_nombre(nombre){
        return await Especialidades.findOne({where: {nombre:nombre}});
    }


    async actualizar_especialidad(req_body, nombre){
        return await Especialidades.update(req_body, {
            where: {nombre: nombre}
        });
    }

    async eliminar_especialidad(nombre){
        return await Clientes.destroy({
            where: {nombre: nombre}
        });
    }
}