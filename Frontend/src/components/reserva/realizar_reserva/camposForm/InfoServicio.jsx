import React from 'react';
import "../Reserva.scss"

const InfoServicio = ({ reservaData, servicio }) => {
    const formatPrice = (price) => {
        if (typeof price === "string") {
            price = parseFloat(price.replace(",", "."));
        }
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(price);
    };
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
                <p className='senia'>{formatPrice(reservaData.montoSenia)}</p>
                {servicio ?
                    <p className="precio">{formatPrice(reservaData.precio)}</p>
                    : <p className="precio">?</p>}
            </div>

        </div>
    );
};

export default InfoServicio;
