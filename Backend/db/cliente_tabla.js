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

export async function inicializarDatosClientes() {
    // Sincronizar el modelo con la base de datos
    await sequelize.sync();

    // Eliminar todos los registros existentes
    await Clientes.destroy({ where: {}, truncate: true });

    // Crear los nuevos registros
    await Clientes.bulkCreate([
        { nombre: 'Alejandro', apellido: 'Castro', email: 'ale.castro@gmail.com', password: 'nail' },
        { nombre: 'Camila', apellido: 'Mendoza', email: 'cami.men@gmail.com', password: 'nail' },
        { nombre: 'Fernando', apellido: 'Ruiz', email: 'fer.rui@gmail.com', password: 'nail' },
        { nombre: 'Isabella', apellido: 'Morales', email: 'isa.mor@gmail.com', password: 'nail' },
        { nombre: 'Miguel', apellido: 'Vargas', email: 'miguelon@gmail.com', password: 'nail' },
        { nombre: 'Elena', apellido: 'Jiménez', email: 'elejime@gmail.com', password: 'nail' },
        { nombre: 'Javier', apellido: 'Torres', email: 'javi.torre@gmail.com', password: 'nail' },
        { nombre: 'Valeria', apellido: 'Herrera', email: 'vale.herrera@gmail.com', password: 'nail' },
        { nombre: 'Roberto', apellido: 'Cruz', email: 'rober.cruz@gmail.com', password: 'nail' },
        { nombre: 'Adriana', apellido: 'Flores', email: 'adri.flower@gmail.com', password: 'nail' },
    ]);
};

// inicializarDatosClientes();