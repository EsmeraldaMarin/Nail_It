import React from 'react';
import { Link } from 'react-router-dom';
import "../reserva/mensaje_exitoso/CardOpExitosa.scss"

const CardOpExitosa = ({ setPasoActual }) => {

    return (
        <div className='container-fluid'>
            <h5>Proximos Pasos</h5>

            <div className="ctn-exito">
                
                <p>Algo salio mal</p>
                
            </div>
        </div>
    );
};

export default CardOpExitosa;
