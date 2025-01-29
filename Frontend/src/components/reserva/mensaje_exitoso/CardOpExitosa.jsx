import React from 'react';
import { Link } from 'react-router-dom';
import "./CardOpExitosa.scss"

const CardOpExitosa = ({ setPasoActual, esDeEstilista }) => {

    return (
        <div className='container-fluid'>
            <div className="ctn-exito">
                <i className='bi bi-check-circle'></i>
                <p>¡Tu reserva ya está registrada!</p>
                {!esDeEstilista && <span>Recibirás un mensaje por Whatsapp de confirmación cuando la operadora compruebe el pago</span>}
                {!esDeEstilista && <span>Podés ver la información de tus reservas en “Mis Reservas”</span>}
                {!esDeEstilista && <Link to="/inicio/mis_reservas" className="btn" onClick={() => {
                    setPasoActual(1)
                    window.scrollTo(0, 0);
                }}>Ir a Mis Reservas</Link>}
            </div>
        </div>
    );
};

export default CardOpExitosa;
