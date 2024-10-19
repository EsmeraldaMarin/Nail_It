import React, { useState, useEffect } from 'react';
import "../Reserva.scss"
import axios from '../../../../axiosConfig/axiosConfig';

const TipoServicio = ({ tiposServicio, tipoServicio, setTipoServicio }) => {

    return (
        <div className="mb-3 tipo-servicio">
            <h5>Seleccione la especialidad</h5>
            <select
                value={tipoServicio == null ? "" : tipoServicio}
                onChange={(e) => { setTipoServicio(e.target.value) }}
                className="form-select">
                {tiposServicio.map((tipoServ, index) => (
                    <option key={index} value={tipoServ.id}>
                        {tipoServ.nombre}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default TipoServicio;
