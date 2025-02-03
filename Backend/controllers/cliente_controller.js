import { Clientes } from "../db/cliente_tabla.js";
import bcrypt from "bcryptjs";

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

    async actualizar_cliente_email(req_body, email){
        return await Clientes.update(req_body, {
            where: {email: email}
        });
    }
    async actualizar_cliente(req_body, id){
        return await Clientes.update(req_body, {
            where: {id: id}
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
    /**
     *
     * @param id Client id
     * @param new_password New unencrypted password to be set
     * @returns {Promise<*>}
     */
    async change_password(id, new_password) {
        new_password = await bcrypt.hash(new_password, 10);

        return await Clientes.update({
            password: new_password,
        }, {
            where: {id: id}
        });
    }
}