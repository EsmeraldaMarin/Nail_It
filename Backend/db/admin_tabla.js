import { DataTypes } from "sequelize";
import { sequelize } from "./database.js";
<<<<<<< HEAD
import { GestorAdmins } from "../controllers/admin_controller.js";
=======
>>>>>>> ecba6c62ded3697c51d1ad22b4f35c711d1fe836


export const Admins = sequelize.define("Admins", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    nombre: { type: DataTypes.STRING },
    apellido: { type: DataTypes.STRING },
    numero: {type:DataTypes.INTEGER},
    email: { type: DataTypes.STRING, /* unique: true */},
    password: {type: DataTypes.STRING},
    verificado: {type: DataTypes.BOOLEAN}
}, {
    tableName: 'Admins',
    timestamps: false
});

<<<<<<< HEAD

=======
>>>>>>> ecba6c62ded3697c51d1ad22b4f35c711d1fe836
Admins.prototype.toString = function (){
    return `|${this.nombre} | ${this.apellido}|${this.email}|${this.usuario}`
}