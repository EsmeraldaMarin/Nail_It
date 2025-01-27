import { sequelize } from "./db/database.js";

async function actualizarColumnaIdCliente() {
    try {
        // Modificar la columna id_cliente para permitir valores NULL
        await sequelize.query("PRAGMA foreign_keys = OFF;"); // Desactiva claves foráneas temporalmente
        await sequelize.query(`
            CREATE TABLE Reservas_temp AS SELECT * FROM Reservas;
        `); // Crea una tabla temporal con los mismos datos

        await sequelize.query(`
            DROP TABLE Reservas;
        `); // Elimina la tabla original

        await sequelize.query(`
            CREATE TABLE Reservas (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                horaInicio TIME NOT NULL,
                fecha DATE NOT NULL,
                comprobante TEXT,
                montoSenia DECIMAL(10, 2) NOT NULL,
                montoTotal DECIMAL(10, 2) NOT NULL,
                id_cliente TEXT,
                id_servicio TEXT NOT NULL REFERENCES Servicios(id),
                id_profesional TEXT NOT NULL REFERENCES Admins(id),
                estado TEXT NOT NULL DEFAULT 'pendiente',
                nombre_cliente TEXT,
                apellido_cliente TEXT,
                telefono_cliente TEXT
            );
        `); // Crea la nueva tabla con `id_cliente` que permite valores NULL

        await sequelize.query(`
            INSERT INTO Reservas SELECT * FROM Reservas_temp;
        `); // Restaura los datos desde la tabla temporal

        await sequelize.query("DROP TABLE Reservas_temp;"); // Elimina la tabla temporal
        await sequelize.query("PRAGMA foreign_keys = ON;"); // Reactiva claves foráneas

        console.log("Columna id_cliente actualizada con éxito para permitir valores NULL.");
    } catch (error) {
        console.error("Error al actualizar la columna id_cliente:", error.message);
    } finally {
        await sequelize.close();
    }
}

//actualizarColumnaIdCliente();
