import { Clientes } from "../db/cliente_tabla.js";
import bcrypt from "bcryptjs";
import { Op } from "sequelize";

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
    
    async obtener_cliente_por_token(token, fechaHoy) {
        return await Clientes.findOne({
            where: {
                reset_token: token,
                reset_expiration: { [Op.gt]: fechaHoy } // Usa el argumento fechaHoy
            }
        });
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
   
}