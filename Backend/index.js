import cors from "cors";
import express from "express";
import { sequelize } from "./db/database.js";
import { routerClientes } from "./routes/cliente_routes.js";
import { GestorClientes } from "./controllers/cliente_controller.js";

const PORT = 5050;

const app = express();
app.use(express.json());
app.use(cors());
await sequelize.sync();

export const gestorClientes = new GestorClientes();

app.use('', routerClientes);

app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));