import { DataTypes } from "sequelize";
import { sequelize } from "./database.js";


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

Admins.prototype.toString = function (){
    return `|${this.nombre} | ${this.apellido}|${this.email}|${this.usuario}`
}