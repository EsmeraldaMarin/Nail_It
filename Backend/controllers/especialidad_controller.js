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

    async obtener_especialidad_por_id(id){
        return await Especialidades.findOne({where: {id: id}});
    }

    async actualizar_especialidad(req_body, id){
        return await Especialidades.update(req_body, {
            where: {id: id}
        });
    }

    async eliminar_especialidad(id){
        return await Especialidades.destroy({
            where: {id: id}
        });
    }
}