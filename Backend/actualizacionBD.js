import { sequelize } from "./db/database.js";
async function actualizarServicios() {
    try {
        console.log("Iniciando actualización de la tabla Servicios...");

        // Desactivar claves foráneas temporalmente (SQLite)
        await sequelize.query("PRAGMA foreign_keys = OFF;");

        // Crear una tabla temporal con los datos existentes
        await sequelize.query(`
            CREATE TABLE Servicios_temp AS SELECT * FROM Servicios;
        `);

        // Eliminar la tabla original
        await sequelize.query("DROP TABLE Servicios;");

        // Crear la nueva tabla con la estructura actualizada
        await sequelize.query(`
            CREATE TABLE Servicios (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nombre TEXT,
                precio DOUBLE,
                duracion INTEGER,
                esta_activo BOOLEAN DEFAULT 1,
                id_especialidad INTEGER,
                FOREIGN KEY (id_especialidad) REFERENCES Especialidades(id)
            );
        `);

        // Rellenar la nueva tabla con los datos existentes desde la tabla temporal
        await sequelize.query(`
            INSERT INTO Servicios (id, nombre, precio, duracion, id_especialidad)
            SELECT id, nombre, precio, duracion, id_especialidad FROM Servicios_temp;
        `);

        // Actualizar los valores de la nueva columna
        await sequelize.query(`
            UPDATE Servicios SET esta_activo = 1;
        `);

        // Eliminar la tabla temporal
        await sequelize.query("DROP TABLE Servicios_temp;");

        // Reactivar claves foráneas
        await sequelize.query("PRAGMA foreign_keys = ON;");

        console.log("Tabla Servicios actualizada con éxito.");
    } catch (error) {
        console.error("Error al actualizar la tabla Servicios:", error.message);
    } finally {
        await sequelize.close();
    }
}

// Llama a la función si quieres ejecutarla directamente
actualizarServicios();
