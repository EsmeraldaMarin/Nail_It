import React from 'react';
import "../Reserva.scss"

const InfoServicio = ({ reservaData, servicio }) => {
    return (
        <div className='infoServicio container-fluid'>
            <p>Duración</p>
            {servicio ?
                <p className="duracion">{reservaData.duracion} minutos</p>
                : <p className="duracion">? minutos</p>}
            <div>
                <p>Seña</p>
                <p>Precio</p>
            </div>
            <div>
                <p className='senia'>${reservaData.montoSenia}</p>
                {servicio ?
                    <p className="precio">${reservaData.precio}</p>
                    : <p className="precio">?</p>}
            </div>

        </div>
    );
};

export default InfoServicio;
