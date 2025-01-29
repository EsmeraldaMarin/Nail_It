import { sequelize } from "./database.js";
import { DataTypes } from "sequelize";

export const Dias_libres = sequelize.define('dias_libres', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true},
    id_admin: { type: DataTypes.INTEGER, allowNull: false,
        references: {
            model: "Admins",
            key: "id"
        }
    },
    fecha_desde: { type: DataTypes.DATE, allowNull: false},
    fecha_hasta: {type: DataTypes.DATE, allowNull: false}
},{
    tableName: 'dias_libres',
    timestamps: false
});

async function resetearTablaDiasLibres() {
    try {
        // Eliminar la tabla 'dias_libres'
        await Dias_libres.drop();
        console.log("Tabla 'dias_libres' eliminada.");

        // Sincronizar nuevamente para recrear la tabla
        await sequelize.sync();
        console.log("Tabla 'dias_libres' recreada.");
    } catch (error) {
        console.error("Error al eliminar y recrear la tabla 'dias_libres':", error);
    }
}

// resetearTablaDiasLibres();

Dias_libres.prototype.toString = function (){
    return ` ${this.id} | ${this.id_admin} | ${this.fecha_desde} | ${this.fecha_hasta}`
}