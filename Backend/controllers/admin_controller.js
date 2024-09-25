import { Admins } from "../db/admin_tabla.js";

export class GestorAdmins{
    async obtener_admins(){
        return await Admins.findAll();
    }

    async crear_admin(req_body){
        return await Admins.create(req_body);
    }

    async obtener_admin_por_email(email){
        return await Admins.findOne({where: {email: email}});
    }

    async actualizar_admin(req_body, updateEmail){
        return await Admins.update(req_body, {
            where: {email: updateEmail}
        });
    }

    async eliminar_admin(email){
        return await Admins.destroy({where:
            {email: email}
        })
    }
}

