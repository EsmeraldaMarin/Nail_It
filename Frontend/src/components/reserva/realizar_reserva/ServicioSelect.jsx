import React from 'react';
import "./Reserva.scss"
import { NULL } from 'sass';

const ServicioSelect = ({ tipoServicio, servicio, setServicio }) => {

    //esto se resuelve cuando este listo el back
    const servicios = {
        manicura: ['Manicure Básica', 'Manicure Completa', 'Manicure Francesa'],
        pedicura: ['Pedicure Básica', 'Pedicure Completa', 'Pedicure Spa'],
        pestañasycejas: ['Uñas Acrílicas', 'Uñas de Gel', 'Relleno de Uñas']
    }
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
                {tipoServicio && servicios[tipoServicio].map((servicio, index) => (
                    <option key={index} value={servicio}>
                        {servicio}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default ServicioSelect;
