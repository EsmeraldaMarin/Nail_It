import { VariablesGlobales } from "../db/variablesGlobales_tabla.js";

export class GestorVariables {
    async obtenerVariables() {
        return await VariablesGlobales.findAll();
    }

    async crearVariable(data) {
        return await VariablesGlobales.create(data);
    }

    async obtenerVariablePorId(id) {
        return await VariablesGlobales.findOne({ where: { id: id } });
    }

    async actualizarVariablePorId(data, id) {
        return await VariablesGlobales.update(data, {
            where: { id: id }
        });
    }

    async eliminarVariablePorId(id) {
        return await VariablesGlobales.destroy({ where: { id: id } });
    }
}
