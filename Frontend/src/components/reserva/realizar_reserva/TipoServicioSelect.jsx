import React, { useState } from 'react';
import "./Reserva.scss"

const TipoServicio = ({ tipoServicio, setTipoServicio }) => {
    return (
        <div className="mb-3 tipo-servicio">
            <h5>Selecciona un tipo de servicio</h5>
            <ul className="nav nav-tabs tipo-servicio-tabs">

                <li className="nav-item">
                    <button
                        className={`nav-link ${tipoServicio === 'manicure' ? 'active' : ''}`}
                        onClick={() => setTipoServicio('manicure')}
                    >
                        Manicure
                    </button>
                </li>

                <li className="nav-item">
                    <button
                        className={`nav-link ${tipoServicio === 'pedicure' ? 'active' : ''}`}
                        onClick={() => setTipoServicio('pedicure')}
                    >
                        Pedicure
                    </button>
                </li>

                <li className="nav-item">
                    <button
                        className={`nav-link ${tipoServicio === 'pestañasycejas' ? 'active' : ''}`}
                        onClick={() => setTipoServicio('pestañasycejas')}
                    >
                        Pestañas o Cejas
                    </button>
                </li>
            </ul>
        </div>
    );
};

export default TipoServicio;
