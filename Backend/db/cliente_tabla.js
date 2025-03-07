import { sequelize } from "./database.js";
import { DataTypes } from "sequelize";

export const Clientes = sequelize.define('Clientes', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    nombre: { type: DataTypes.STRING },
    apellido: { type: DataTypes.STRING },
    numero: {type:DataTypes.STRING},
    email: { type: DataTypes.STRING, /* unique: true */ },
    password: {type: DataTypes.STRING},
    verificado: {type: DataTypes.BOOLEAN},
    cbu: {type: DataTypes.STRING, allowNull: true},
    titular_cuenta: {type: DataTypes.STRING, allowNull: true},
    reset_token: {type: DataTypes.STRING, allowNull: true},
    reset_expiration: {type: DataTypes.DATE, allowNull: true},
},{
    tableName: 'Clientes',
    timestamps: false
});

Clientes.prototype.toString = function (){
    return ` ${this.nombre} | ${this.apellido} | ${this.email}`
}

