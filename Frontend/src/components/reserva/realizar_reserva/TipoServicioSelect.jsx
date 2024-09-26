import React, { useState } from 'react';
import "./Reserva.scss"

const TipoServicio = ({ tipoServicio, setTipoServicio }) => {
    //esto se trae de la bd
    let tipoDeServicios = ["manicura", "pedicura", "pestañasycejas"]
    return (
        <div className="mb-3 tipo-servicio">
            <h5>Selecciona un tipo de servicio</h5>
            <select
                value={tipoServicio == null ? "" : tipoServicio}
                onChange={(e) => setTipoServicio(e.target.value)}
                className="form-select"

            >
                <option value="">Ninguno</option>
                {tipoDeServicios.map((tipoServ, index) => (
                    <option key={index} value={tipoServ}>
                        {tipoServ}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default TipoServicio;
