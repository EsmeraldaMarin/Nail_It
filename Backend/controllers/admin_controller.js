import { Admins } from "../db/admin_tabla.js";

export class GestorAdmins {
    async obtener_admins() {
        try {
            return await Admins.findAll();
        } catch(err){
            console.log(err)
        }
    }

    async crear_admin(req_body) {
        return await Admins.create(req_body);
    }

    async obtener_admin_por_email(email) {
        return await Admins.findOne({ where: { email: email } });
    }
    async obtener_admin(id) {
        return await Admins.findOne({ where: { id: id } });
    }

    async actualizar_admin_por_id(req_body, id) {
        return await Admins.update(req_body, {
            where: { id: id }
        });
    }

    async actualizar_admin_por_email(req_body, updateEmail) {
        return await Admins.update(req_body, {
            where: { email: updateEmail }
        });
    }

    async eliminar_admin(email) {
        return await Admins.destroy({
            where:
                { email: email }
        })
    }
}

