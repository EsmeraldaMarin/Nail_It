import { DataTypes } from "sequelize";
import { sequelize } from "./database.js";
import { GestorAdmins } from "../controllers/admin_controller.js";


export const Admins = sequelize.define("Admins", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    nombre: { type: DataTypes.STRING },
    apellido: { type: DataTypes.STRING },
    numero: {type:DataTypes.STRING},
    email: { type: DataTypes.STRING, /* unique: true */},
    password: {type: DataTypes.STRING},
    mustChangePassword: {type: DataTypes.BOOLEAN},
    verificado: {type: DataTypes.BOOLEAN},
    reset_token: {type: DataTypes.STRING, allowNull: true},
    reset_expiration: {type: DataTypes.DATE, allowNull: true},
}, {
    tableName: 'Admins',
    timestamps: false
});


Admins.prototype.toString = function (){
    return `|${this.nombre} | ${this.apellido}|${this.email}|${this.usuario}`
}