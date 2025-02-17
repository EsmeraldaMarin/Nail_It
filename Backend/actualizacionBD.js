import { sequelize } from "./db/database.js";

async function actualizarClientesYAdmins() {
    try {
        console.log("Iniciando actualización de las tablas Clientes y Admins...");

        // Desactivar claves foráneas temporalmente (SQLite)
        await sequelize.query("PRAGMA foreign_keys = OFF;");

        // ======================== CLIENTES ========================
        console.log("Actualizando tabla Clientes...");

        // Crear tabla temporal con los datos actuales
        await sequelize.query("CREATE TABLE Clientes_temp AS SELECT * FROM Clientes;");

        // Eliminar la tabla original
        await sequelize.query("DROP TABLE Clientes;");

        // Crear la nueva tabla con la estructura actualizada
        await sequelize.query(`
            CREATE TABLE Clientes (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nombre TEXT,
                apellido TEXT,
                numero TEXT,
                email TEXT,
                password TEXT,
                verificado BOOLEAN,
                cbu TEXT NULL,
                titular_cuenta TEXT NULL,
                reset_token TEXT NULL,
                reset_expiration DATETIME NULL
            );
        `);

        // Restaurar los datos desde la tabla temporal
        await sequelize.query(`
            INSERT INTO Clientes (id, nombre, apellido, numero, email, password, verificado, cbu, titular_cuenta)
            SELECT id, nombre, apellido, numero, email, password, verificado, cbu, titular_cuenta FROM Clientes_temp;
        `);

        // Eliminar la tabla temporal
        await sequelize.query("DROP TABLE Clientes_temp;");

        console.log("Tabla Clientes actualizada.");

        // ======================== ADMINS ========================
        console.log("Actualizando tabla Admins...");

        // Crear tabla temporal con los datos actuales
        await sequelize.query("CREATE TABLE Admins_temp AS SELECT * FROM Admins;");

        // Eliminar la tabla original
        await sequelize.query("DROP TABLE Admins;");

        // Crear la nueva tabla con la estructura actualizada
        await sequelize.query(`
            CREATE TABLE Admins (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nombre TEXT,
                apellido TEXT,
                numero TEXT,
                email TEXT,
                password TEXT,
                mustChangePassword BOOLEAN,
                verificado BOOLEAN,
                reset_token TEXT NULL,
                reset_expiration DATETIME NULL
            );
        `);

        // Restaurar los datos desde la tabla temporal
        await sequelize.query(`
            INSERT INTO Admins (id, nombre, apellido, numero, email, password, mustChangePassword, verificado)
            SELECT id, nombre, apellido, numero, email, password, mustChangePassword, verificado FROM Admins_temp;
        `);

        // Eliminar la tabla temporal
        await sequelize.query("DROP TABLE Admins_temp;");

        console.log("Tabla Admins actualizada.");

        // Reactivar claves foráneas
        await sequelize.query("PRAGMA foreign_keys = ON;");

        console.log("✅ Actualización de las tablas finalizada con éxito.");
    } catch (error) {
        console.error("❌ Error al actualizar las tablas:", error.message);
    } finally {
        await sequelize.close();
    }
}

// Ejecutar la función
//actualizarClientesYAdmins();
