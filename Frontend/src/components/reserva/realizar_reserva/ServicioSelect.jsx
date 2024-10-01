import React, { useState, useEffect } from 'react';
import "./Reserva.scss"

const ServicioSelect = ({ tipoServicio, servicio, setServicio, servicios }) => {

    return (
        <div className="mb-3">
            <label>Seleccione el servicio</label>
            <select
                value={servicio == null ? "" : servicio}
                onChange={(e) => setServicio(e.target.value)}
                className="form-select"
                disabled={tipoServicio === null}
            >
                <option value="">Seleccione un servicio</option>
            
                {tipoServicio && servicios.map((servicio, index) => (
                    <option key={index} value={servicio.id}>
                        {servicio.nombre}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default ServicioSelect;
