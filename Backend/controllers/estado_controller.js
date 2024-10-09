import { Estados } from "../db/estado_tabla.js";

export class GestorEstados{
    async obtener_estados(){
        return await Estados.findAll();
    }

    async crear_estado(req_body){
        return await Estados.create(req_body);
    }

    async obtener_estado_por_id(id){
        return await Estados.findOne({where: {id:id}});
    }

    async obtener_estado_por_nombre(nombre){
        return await Estados.findOne({where: {nombre: nombre}})
    }

    async actualizar_estado(req_body, id){
        return await Estados.update(req_body, {
            where: {id: id}
        });
    }

    async eliminar_estado(idSelec){
        return await Estados.destroy({
            where: {id: idSelec}
        });
    }

}