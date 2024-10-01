import cors from "cors";
import express from "express";
import { sequelize } from "./db/database.js";
import { routerClientes } from "./routes/cliente_routes.js";
import { GestorClientes } from "./controllers/cliente_controller.js";
import { GestorAdmins } from "./controllers/admin_controller.js";
import { routerAdmins } from "./routes/admins_routes.js";
import { GestorEspecialidades } from "./controllers/especialidad_controller.js";
import { routerEspecialidades } from "./routes/especialidad_routes.js";
import { GestorServicios } from "./controllers/servicio_controller.js";
import { Especialidades } from "./db/especialidad_tabla.js";
import { Servicios } from "./db/servicio_tabla.js";
import { routerServicios } from "./routes/servicio_routes.js";
import { routerVerificar } from "./security/auth.js";
import fs from "fs";
import { routerReservas } from "./routes/reserva_routes.js";
import { GestorReservas } from "./controllers/reserva_controller.js";
import { Reservas } from "./db/reserva_tabla.js";
import { Clientes } from "./db/cliente_tabla.js";

const PORT = 5050;

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

await sequelize.sync();

export const gestorClientes = new GestorClientes();
export const gestorAdmins = new GestorAdmins();
export const gestorEspecialidades = new GestorEspecialidades();
export const gestorServicios = new GestorServicios();
export const gestorReservas = new GestorReservas()

Especialidades.hasMany(Servicios, { foreignKey: 'id_especialidad' });
Servicios.belongsTo(Especialidades, { foreignKey: 'id_especialidad' });

Reservas.belongsTo(Servicios, { foreignKey: 'id_servicio' });
Servicios.hasMany(Reservas, { foreignKey: 'id_servicio' });

Reservas.belongsTo(Clientes, { foreignKey: 'id_cliente' });
Clientes.hasMany(Reservas, { foreignKey: 'id_cliente' });


// Definición de relaciones entre tablas.

app.use('', routerClientes);
app.use('/admin', routerAdmins);
app.use("/especialidad", routerEspecialidades);
app.use("/servicio", routerServicios);
app.use("/reserva", routerReservas);
app.use("/verificar", routerVerificar);

app.listen(PORT, () =>
    console.log(`Servidor corriendo en http://localhost:${PORT}`));