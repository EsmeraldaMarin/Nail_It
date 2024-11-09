import React, { useState, useEffect } from "react";
import "./Horarios.scss";
import axios from '../../axiosConfig/axiosConfig';

export default function Vacaciones() {


    return (
        <div className="ctn-horarios">
            <h3>Mis días libres</h3>
            <div className="form-horario-atencion">
                <p>Seleccione el rango de días libres:</p>
                <label>Fecha desde:</label>
                <input
                    type="date"
                    className="form-control"
                    required
                />
                <label>Fecha hasta:</label>
                <input
                    type="date"
                    className="form-control"
                    required
                />
                <button className="btn btn-success mt-3">Confirmar</button>
            </div>
        </div >
    );
}