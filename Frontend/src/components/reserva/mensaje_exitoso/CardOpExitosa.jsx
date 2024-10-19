import React from 'react';
import { Link } from 'react-router-dom';
import "./CardOpExitosa.scss"

const CardOpExitosa = ({ setPasoActual }) => {

    return (
        <div className='container-fluid'>
            <h5>Próximos pasos</h5>

            <div className="ctn-exito">
                <i className='bi bi-check-circle'></i>
                <p>¡Tu reserva ya está registrada!</p>
                <span>Recibirás un mensaje de confirmación por Whatsapp cuando la estilista compruebe el pago</span>
                <span>Podés ver la información de tus reservas en “Mis Reservas”</span>
                <Link to="/inicio/mis_reservas" className="btn" onClick={()=>setPasoActual(1)}>Ir a Mis Reservas</Link>
            </div>
        </div>
    );
};

export default CardOpExitosa;
