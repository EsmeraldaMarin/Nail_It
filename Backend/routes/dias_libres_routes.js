import express from 'express';
import { GestorDiasLibres } from '../controllers/dias_libres_controller.js'; // Tu gestor para los días libres

export const routerDiasLibres = express.Router();

const gestorDiasLibres = new GestorDiasLibres();

// **Consultar todos los días libres**
routerDiasLibres.get("/", async (req, res) => {
    try {
        const datos = await gestorDiasLibres.obtener_dias_libres();
        if (datos) {
            res.status(200).json(datos);
        } else {
            res.status(500).send("Error al obtener los días libres.");
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// **Consultar un día libre por ID**
routerDiasLibres.get("/:id", async (req, res) => {
    const id = req.params.id;
    try {
        const datos = await gestorDiasLibres.obtener_diaslibres_por_id(id);
        if (datos) {
            res.status(200).json(datos);
        } else {
            res.status(404).send("Día libre no encontrado.");
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// **Registrar un nuevo día libre (ALTA)**
routerDiasLibres.post("/", async (req, res) => {
    try {
        const { id_admin, fecha_desde, fecha_hasta } = req.body;

        if (!id_admin || !fecha_desde || !fecha_hasta) {
            return res.status(400).json({ message: "Todos los campos son requeridos (id_admin, fecha_Desde, fecha_Hasta)." });
        }

        // Aquí puedes imprimir los datos que recibes
        console.log('Datos recibidos:', req.body);

        const nuevoDiaLibre = await gestorDiasLibres.crear_dia_libre(req.body);
        res.status(201).json(nuevoDiaLibre);
    } catch (error) {
        // Imprime el error completo para más detalles
        console.error('Error al crear día libre:', error);
        res.status(500).json({ error: "No se pudo crear el día libre.", detalles: error.message });
    }
});

// **Actualizar un día libre (MODIFICACIÓN)**
routerDiasLibres.put("/:id", async (req, res) => {
    const id = req.params.id;
    try {
        // Validar si el día libre existe
        const diaLibreExistente = await gestorDiasLibres.obtener_diaslibres_por_id(id);
        if (!diaLibreExistente) {
            return res.status(404).send("Día libre no encontrado.");
        }

        // Actualizar el día libre con los nuevos datos
        const diaLibreActualizado = await gestorDiasLibres.actualizar_diaslibres_por_id(req.body, id);
        res.status(202).json(diaLibreActualizado);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// **Eliminar un día libre (BAJA)**
routerDiasLibres.delete("/:id", async (req, res) => {
    const id = req.params.id;
    try {
        // Verificar si el día libre existe
        const diaLibreExistente = await gestorDiasLibres.obtener_diaslibres_por_id(id);
        if (!diaLibreExistente) {
            return res.status(404).send("Día libre no encontrado.");
        }

        // Eliminar el día libre
        await gestorDiasLibres.eliminar_diaslibres(id);
        res.status(200).json({ message: "Día libre eliminado exitosamente." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default routerDiasLibres;
