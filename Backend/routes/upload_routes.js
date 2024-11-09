import pkg from 'express';
const { Router } = pkg;
import multer from "multer";
import path from "path";
import fs from "fs";

import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Ruta relativa al archivo app.js
    },
    filename: (req, file, cb) => {
        // cb(null, Date.now() + path.extname(file.originalname)); // Renombrar archivo
        cb(null, file.originalname); // usar el nombre original
    }
});

export const upload = multer({ storage, 
    limits: {
        fileSize: 1 * 1024 * 20240 // 512Kb de maximo tamaño por archivo.
    }
 });
export const uploadRouter = Router();


uploadRouter.post("/uploads", upload.single('comprobante'), (req, res) => {
    if (req.file) {
        return res.json({ message: "Archivo subido con éxito!", file: req.file });
    }
    return res.status(400).json({ message: "No se subió ningún archivo." });
});

// Pueden si les trae la imagen con http://localhost:5050/api/files/"nombre del archivo" el nombre del archivo con la extensión que corresponde.

uploadRouter.get("/files/:filename", (req, res) => {
    const { filename } = req.params;
    const filePath = path.join(__dirname, '../uploads', filename); // Ruta absoluta
    console.log(`Intentando acceder a: ${filePath}`); // Mensaje de depuración

    // Verificar si el archivo existe
    fs.stat(filePath, (err, stats) => {
        if (err) {
            return res.status(404).json({ message: "Archivo no encontrado." });
        }
        res.sendFile(filePath); // Enviar el archivo
    });
});