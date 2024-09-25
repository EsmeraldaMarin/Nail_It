import cors from "cors";
import express from "express";
import { sequelize } from "./db/database.js";
import { routerClientes } from "./routes/cliente_routes.js";
import { GestorClientes } from "./controllers/cliente_controller.js";
import { GestorAdmins } from "./controllers/admin_controller.js";
import { routerAdmins } from "./routes/admins_routes.js";

const PORT = 5050;

const app = express();
app.use(express.json());
app.use(cors());
await sequelize.sync();

export const gestorClientes = new GestorClientes();
export const gestorAdmins = new GestorAdmins();

app.use('', routerClientes);
app.use('', routerAdmins);

app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));