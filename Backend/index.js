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
import { routerReservas } from "./routes/reserva_routes.js";
import { GestorReservas } from "./controllers/reserva_controller.js";
import { Reservas } from "./db/reserva_tabla.js";
import { Clientes } from "./db/cliente_tabla.js";
import { GestorEstados } from "./controllers/estado_controller.js";
import { routerEstados } from "./routes/estado_routes.js";
import { Admins } from "./db/admin_tabla.js";
import { routerVariablesGlobales } from "./routes/variables_globales_routes.js";
import { GestorVariables } from "./controllers/variableGlobal_controller.js";
import { AdminHorarioEspecialidad } from "./db/adminHorarioEspecialidad_tabla.js";
import { GestorAdminHorarioEspecialidad } from "./controllers/adminHorarioEspecialidad_controller.js";
import { routerAdminHorarioEspecialidad } from "./routes/adminHorarioEspecialidad_routes.js";
import { GestorDiasLibres } from "./controllers/dias_libres_controller.js";
import routerDiasLibres from "./routes/dias_libres_routes.js";
import routerPassword from "./controllers/services/forgot_password.service.js";
import cron from "node-cron";

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
export const gestorReservas = new GestorReservas();
export const gestorEstados = new GestorEstados();
export const gestorVariablesglobales = new GestorVariables();
export const gestorAdminHorarioEspecialidad = new GestorAdminHorarioEspecialidad();
export const gestorDiasLibres = new GestorDiasLibres();

Especialidades.hasMany(Servicios, { foreignKey: 'id_especialidad' });
Servicios.belongsTo(Especialidades, { foreignKey: 'id_especialidad', as: 'Especialidad' }); // Define el alias aquí

Reservas.belongsTo(Servicios, { foreignKey: 'id_servicio' });
Servicios.hasMany(Reservas, { foreignKey: 'id_servicio' });

Reservas.belongsTo(Clientes, { foreignKey: 'id_cliente' });
Clientes.hasMany(Reservas, { foreignKey: 'id_cliente' });

Reservas.belongsTo(Admins, { foreignKey: 'id_profesional' });
Admins.hasOne(Reservas, { foreignKey: 'id_profesional' });

Especialidades.hasMany(AdminHorarioEspecialidad, { foreignKey: 'id_especialidad' });
AdminHorarioEspecialidad.belongsTo(Especialidades, { foreignKey: 'id_especialidad' , as: 'Especialidad'});


// Definición de relaciones entre tablas.
app.use('', routerClientes);
app.use('/admin', routerAdmins);
app.use("/especialidad", routerEspecialidades);
app.use("/servicio", routerServicios);
app.use("/reserva", routerReservas);
app.use("/verificar", routerVerificar);
app.use("/estado", routerEstados);
app.use("/horario", routerAdminHorarioEspecialidad);
app.use("/variablesGlobales", routerVariablesGlobales);
app.use("/auth", routerPassword);
app.use("/diasLibres", routerDiasLibres);

app.listen(PORT, () =>
    console.log(`Servidor corriendo en http://localhost:${PORT}`));


cron.schedule('0 0 0 * * *', async () => {
    const previousDate = new Date();
    previousDate.setDate(previousDate.getDate() - 1);
    const fecha = previousDate.toISOString().split('T')[0];

    await gestorReservas.cancelar_reservas_pendientes_del_dia(fecha);
});


// TEST
cron.schedule('0 * * * * *', () => {
    const previousDate = new Date();
    previousDate.setDate(previousDate.getDate() - 1);
    const fecha = previousDate.toISOString().split('T')[0];

    // Alternative code
    // const tzoffset = (new Date()).getTimezoneOffset() * 60000;
    // const localISODate = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1);
    // // const currentDate = "2024-11-08";
    // const currentDate = (localISODate).split('T')[0];

    console.log(previousDate);
});