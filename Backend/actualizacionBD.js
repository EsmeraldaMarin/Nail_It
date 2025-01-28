import { sequelize } from "./db/database.js";

async function actualizarVariablesGlobales() {
    try {
        console.log("Iniciando actualización de la tabla variablesGlobales...");

        // Desactiva claves foráneas temporalmente
        await sequelize.query("PRAGMA foreign_keys = OFF;");

        // Crear una tabla temporal con los datos existentes
        await sequelize.query(`
            CREATE TABLE variablesGlobales_temp AS SELECT * FROM variablesGlobales;
        `);

        // Eliminar la tabla original
        await sequelize.query("DROP TABLE variablesGlobales;");

        // Crear la nueva tabla con la estructura actualizada
        await sequelize.query(`
            CREATE TABLE variablesGlobales (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                horario_apertura TEXT,
                horario_cierre TEXT,
                cbu TEXT,
                cvu TEXT,
                alias TEXT,
                titular_cuenta TEXT,
                cuil TEXT
            );
        `);

        // Rellenar la nueva tabla con los datos existentes desde la tabla temporal
        await sequelize.query(`
            INSERT INTO variablesGlobales (id, horario_apertura, horario_cierre, cbu, cvu, alias, titular_cuenta)
            SELECT id, horario_apertura, horario_cierre, cbu, cvu, alias, titular_cuenta
            FROM variablesGlobales_temp;
        `);

        // Eliminar la tabla temporal
        await sequelize.query("DROP TABLE variablesGlobales_temp;");

        // Reactivar claves foráneas
        await sequelize.query("PRAGMA foreign_keys = ON;");

        console.log("Tabla variablesGlobales actualizada con éxito.");
    } catch (error) {
        console.error("Error al actualizar la tabla variablesGlobales:", error.message);
    } finally {
        // Cerrar la conexión con la base de datos
        await sequelize.close();
    }
}

// Llama a la función si quieres ejecutarla directamente
//actualizarVariablesGlobales();
