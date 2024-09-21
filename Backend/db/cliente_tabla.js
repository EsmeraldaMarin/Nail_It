import { sequelize } from "./database.js";
import { DataTypes } from "sequelize";

export const Clientes = sequelize.define('Clientes', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    nombre: { type: DataTypes.STRING },
    apellido: { type: DataTypes.STRING },
    email: { type: DataTypes.STRING },
    password: {type: DataTypes.STRING}
}, {
    tableName: 'Clientes', timestamps: false
});

Clientes.prototype.toString = function (){
    return `|${this.nombre} | ${this.apellido}|${this.email}`
}