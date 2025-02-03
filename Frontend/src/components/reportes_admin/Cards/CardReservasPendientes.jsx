import React from "react";
import { Link } from 'react-router-dom';
import '../Reportes.scss'

const CardReporteReservasPendientes = ({ index, cantReservasAConfirmar, cantReservasAReembolsar }) => {
    return (
        <div className="card-reporte-reserva mb-3 d-flex flex-column justify-content-between">
            <h4 className="text-capitalize">Total Reservas Pendientes</h4>

            <div className="d-flex justify-content-between mt-3">
                <div className="d-flex flex-column justify-content-center">
                    <span className="text-center">Por Confirmar</span>
                    <p className="m-0 fw-bold text-center" style={{ fontSize: "5.3em", transform:'translatey(-20px)' }}>{cantReservasAConfirmar}</p>
                </div>
                <div  className="d-flex flex-column justify-content-center">
                    <span className="text-center">Por Confirmar</span>
                    <p className="m-0 fw-bold text-center" style={{ fontSize: "5.3em", transform:'translatey(-20px)' }}>{cantReservasAReembolsar}</p>
                </div>
            </div>
            <div className="d-flex align-items-end justify-content-between"  style={{transform:'translateY(-25px)'}}>
                <Link className="btn-ver-lista" to={'/inicio_admin/reservas_pendientes'}>Ir a Reservas Pendientes</Link>
                <i></i>
            </div>
        </div>
    )
};

export default CardReporteReservasPendientes;