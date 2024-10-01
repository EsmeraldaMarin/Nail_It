import React from 'react';
import "./Reserva.scss"

const InfoServicio = ({servicio}) => {
    return (
        <div className='infoServicio container-fluid'>
            <p>Duracion</p>
            <p className="duracion">40 minutos</p>
            <div>
                <p>Senia</p>
                <p>Precio</p>
            </div>
            <div>
                <p className='senia'>$X.XXX</p>
                <p className="precio">$XX.XXX</p>
            </div>

        </div>
    );
};

export default InfoServicio;
