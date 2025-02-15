import { DataTypes } from "sequelize";
import { sequelize } from "./database.js";
import { Especialidades } from "./especialidad_tabla.js";

export const Servicios = sequelize.define('Servicios', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    nombre: { type: DataTypes.STRING },
    precio: { type: DataTypes.DOUBLE },
    duracion: { type: DataTypes.INTEGER },
    esta_activo: { type: DataTypes.BOOLEAN, defaultValue: true }, 
    id_especialidad: {
        type: DataTypes.INTEGER,
        references: {
            model: Especialidades,
            key: 'id'
        }
    }
}, {
    tableName: "Servicios",
    timestamps: false
});

Servicios.toString = function () {
    return ` ${this.nombre} | ${this.precio} | ${this.duracion} | ${this.esta_activo}`;
};
