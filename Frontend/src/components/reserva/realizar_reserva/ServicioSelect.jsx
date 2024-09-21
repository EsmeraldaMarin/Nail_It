import React from 'react';
import "./Reserva.scss"

const ServicioSelect = ({ tipoServicio, servicio, setServicio }) => {

    //esto se resuelve cuando este listo el back
    const servicios = {
        manicure: ['Manicure Básica', 'Manicure Completa', 'Manicure Francesa'],
        pedicure: ['Pedicure Básica', 'Pedicure Completa', 'Pedicure Spa'],
        pestañasycejas: ['Uñas Acrílicas', 'Uñas de Gel', 'Relleno de Uñas']
    }
    return (
        <div className="mb-3">
            <label>Seleccione el servicio</label>
            <select
                value={servicio}
                onChange={(e) => setServicio(e.target.value)}
                className="form-select"
            >
                <option value="">Seleccione un servicio</option>
                {servicios[tipoServicio].map((servicio, index) => (
                    <option key={index} value={servicio}>
                        {servicio}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default ServicioSelect;
