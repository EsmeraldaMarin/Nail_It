import { Clientes } from "../db/cliente_tabla.js";

export class GestorClientes{
    async obtener_clientes(){
        return await Clientes.findAll();
    }

    async crear_cliente(req_body){
        return await Clientes.create(req_body);
    }

    async obtener_cliente(id){
        return await Clientes.findOne({where: {id:id}});
    }

    async obtener_cliente_por_email(email){
        return await Clientes.findOne({where: {email: email}});
    }

    async actualizar_cliente(req_body, email){
        return await Clientes.update(req_body, {
            where: {email: email}
        });
    }

    async eliminar_cliente(idSelec){
        return await Clientes.destroy({
            where: {id: idSelec}
        });
    }

    async eliminar_cliente_email(mail){
        return await Clientes.destroy({
            where: {email: mail}
        })
    }

}