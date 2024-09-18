import cors from "cors";
import express from "express";


const PORT = 5050;

const app = express();

app.use(express.json());
app.use(cors());

app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));