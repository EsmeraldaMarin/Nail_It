import React from "react";
import { useNavigate } from "react-router-dom";

export default function ErrorPage() {
    const navigate = useNavigate();

    return (
        <div className="contenedor_error">
            <h1 className="titulo_error">Error</h1>
            <p className="texto_error">La URL ingresada no existe</p>
            <button onClick={() => navigate("/inicio")} className="btn btn-primary">
                Volver al Inicio
            </button>
        </div>
    );
}