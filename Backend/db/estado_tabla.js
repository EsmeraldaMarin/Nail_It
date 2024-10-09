import { DataTypes } from "sequelize";
import { sequelize } from "./database.js";

// tipo de servicio 
export const Estados = sequelize.define('Estados', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true},
    nombre: {type: DataTypes.STRING},
    descripcion: {type: DataTypes.STRING}
}, {
    tableName: "Estados", 
    timestamps: false
});