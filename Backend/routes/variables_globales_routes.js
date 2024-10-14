import pkg from 'express';
const { Router } = pkg;
import { gestorVariablesglobales } from "../index.js";

export const routerVariablesGlobales = Router();

routerVariablesGlobales.get('/', async (req, res) => {
    try {
        const variables = await gestorVariablesglobales.obtenerVariables();
        res.json(variables);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener las variables.' });
    }
});

// routerVariablesGlobales.post('/', async (req, res) => {
//     const nuevaVariable = await gestorVariablesglobales.crearVariable(req.body);
//     res.status(201).json(nuevaVariable);
// });

routerVariablesGlobales.get('/:id', async (req, res) => {
    const variable = await gestorVariablesglobales.obtenerVariablePorId(req.params.id);
    if (!variable) {
        return res.status(404).json({ message: 'Variable no encontrada.' });
    }
    res.json(variable);
});

routerVariablesGlobales.put('/:id', async (req, res) => {
    const [actualizados] = await gestorVariablesglobales.actualizarVariablePorId(req.body, req.params.id);
    if (actualizados === 0) {
        return res.status(404).json({ message: 'Variable no encontrada.' });
    }
    res.json({ message: 'Variable actualizada.' });
});

// routerVariablesGlobales.delete('/:id', async (req, res) => {
//     const eliminados = await gestorVariablesglobales.eliminarVariablePorId(req.params.id);
//     if (eliminados === 0) {
//         return res.status(404).json({ message: 'Variable no encontrada.' });
//     }
//     res.json({ message: 'Variable eliminada.' });
// });