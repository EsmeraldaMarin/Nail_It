import { DataTypes } from "sequelize";
import { sequelize } from "./database.js";
import { Especialidades } from "./especialidad_tabla.js";
import { Admins } from "./admin_tabla.js";

// Tabla intermedia entre Estilistas (Admins), Especialidad y Horarios
export const AdminHorarioEspecialidad = sequelize.define('AdminHorarioEspecialidad', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    dia_semana: {
        type: DataTypes.ENUM('Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'),
        allowNull: false
    },
    hora_inicio: {
        type: DataTypes.TIME,
        allowNull: false
    },
    hora_fin: {
        type: DataTypes.TIME,
        allowNull: false
    },
    id_profesional: {
        type: DataTypes.INTEGER,
        references: {
            model: Admins,
            key: 'id'
        },
        allowNull: false
    },
    id_especialidad: {
        type: DataTypes.INTEGER,
        references: {
            model: Especialidades,
            key: 'id'
        },
        allowNull: false
    },
}, {
    tableName: "AdminHorarioEspecialidad",
    timestamps: false
});
