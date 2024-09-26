import React from 'react';
import { Link } from 'react-router-dom';
import "./CardOpExitosa.scss"

const CardOpExitosa = ({ setPasoActual }) => {

    return (
        <div className='container-fluid'>
            <h5>Proximos Pasos</h5>

            <div className="ctn-exito">
                <i className='bi bi-check-circle'></i>
                <p>¡Tu reserva ya esta registrada!</p>
                <span>Recibirás un mensaje de confirmación por Whatsapp cuando la estilista compruebe el pago</span>
                <span>Podés ver la info de tus reservas en “Mis Reservas”</span>
                <Link to="/inicio" className="btn" onClick={()=>setPasoActual(1)}>Ir a Mis Reservas</Link>
            </div>
        </div>
    );
};

export default CardOpExitosa;
