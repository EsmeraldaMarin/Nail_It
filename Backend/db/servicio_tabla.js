import { DataTypes } from "sequelize";
import { sequelize } from "./database.js";


export const Servicios = sequelize.define('Servicios', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    nombre: { type: DataTypes.STRING },
    precio: {type: DataTypes.DOUBLE},
    duracion: {type: DataTypes.INTEGER}, // EN MINUTOS INTEGER.
    id_especialidad: {type: DataTypes.INTEGER}
},{
    tableName: "Servicios",
    timestamps: false
    });

Servicios.toString = function(){
    return ` ${this.nombre} | ${this.precio} | ${this.duracion}`
}

