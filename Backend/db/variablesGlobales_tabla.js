import { sequelize } from "./database.js";
import { DataTypes } from "sequelize";

export const VariablesGlobales = sequelize.define('variablesGlobales', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    horario_apertura: { type: DataTypes.STRING },
    horario_cierre: { type: DataTypes.STRING },
    cbu: {type:DataTypes.STRING},
    cvu: { type: DataTypes.STRING, /* unique: true */ },
    alias: {type: DataTypes.STRING},
    titular_cuenta: {type: DataTypes.STRING},
    cuil: {type: DataTypes.STRING}
}, {
    tableName: 'variablesGlobales',
    timestamps: false
});

const inicializarVariables = async () => {
    try {
        await sequelize.sync(); // Sincroniza el modelo con la base de datos

        const count = await VariablesGlobales.count();
        
        if (count === 0) {
            // Si no hay registros, insertar uno
            await VariablesGlobales.create({
                horario_apertura: '08:00',
                horario_cierre: '18:00',
                cbu: '',
                cvu: '',
                alias: 'ohmynails.mp',
                titular_cuenta: 'true',
                cuil:''
            });
            console.log("Registro inicial creado.");
        } else {
            console.log("La tabla ya tiene registros.");
        }
    } catch (error) {
        console.error("Error al inicializar la tabla:", error);
    }
};

inicializarVariables();