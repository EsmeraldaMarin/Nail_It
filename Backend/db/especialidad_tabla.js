import { DataTypes } from "sequelize";
import { sequelize } from "./database.js";

// tipo de servicio 
export const Especialidades = sequelize.define('Especialidades', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true},
    nombre: {type: DataTypes.STRING},
    descripcion: {type: DataTypes.STRING}
}, {
    tableName: "Especialidades", 
    timestamps: false
});

