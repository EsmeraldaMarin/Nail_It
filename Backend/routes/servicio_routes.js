import { Router } from "express";
import { gestorServicios } from "../index.js";


export const routerServicios = Router();

routerServicios.get("/", async (req,res) => {
    const datos = await gestorServicios.obtener_servicios();
    if (datos){
        res.status(200).json(datos);
    }else{
        res.status(400).json("Error!");
    }
})