import { DataTypes } from "sequelize";
import { sequelize } from "./database.js";
import { Servicios } from "./servicio_tabla.js";
import { Clientes } from "./cliente_tabla.js";

// tipo de servicio 
export const Reservas = sequelize.define('Reservas', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    horaInicio: {
        type: DataTypes.TIME,
        allowNull: false
    },
    fecha:{
        type: DataTypes.DATE,
        allowNull: false
    },
    comprobante: {
        type: DataTypes.STRING,
        allowNull: true
    },
    montoSenia: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    montoTotal: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    id_cliente: {
        type: DataTypes.STRING,
        references: {
            model: Clientes,
            key: 'id'
        },
        allowNull: false
    },
    id_servicio: {
        type: DataTypes.STRING,
        references: {
            model: Servicios,
            key: 'id'
        },
        allowNull: false
    },
    estado: {
        type: DataTypes.ENUM('pendiente', 'confirmada', 'cancelada'),
        allowNull: false,
        defaultValue: 'pendiente'
    }
}, {
    tableName: "Reservas",
    timestamps: false
});
