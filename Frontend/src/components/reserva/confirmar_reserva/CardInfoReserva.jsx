import React from 'react';
import "./CardInfoReserva.scss"

const CardInfoReserva = ({ setPasoActual, reservaData }) => {
    const { profesional, fecha, servicio, tipoServicio, horario, monto } = reservaData;
    const handleConfirm = () => {

        // Lógica de confirmación de reserva aquí (opcional)
        // Luego de confirmar, redirige a otra vista
        setPasoActual(3);
    };
    return (
        <div className='container-fluid'>
            <h5>Informacion sobre tu reserva</h5>

            <div className='info-ctn'>

                <div>
                    <button onClick={() => setPasoActual(1)}><i className='bi bi-chevron-left'></i></button>
                    <p>
                        Reserva para:
                        <span className='servicio'>{servicio}</span>
                    </p>
                </div>
                <div >
                    <div>
                        <p>Fecha</p>
                        <p className="fecha">{fecha}</p>
                    </div>
                    <div>
                        <p>Horario</p>
                        <p className="horario">{horario}<span> hs</span></p>
                    </div>
                </div>
                <div>
                    <p>Profesional: <span className='profesional'>{profesional}</span></p>
                </div>
                <div>
                    <div>
                        <p>Monto de Seña a abonar</p>
                        <p className="monto">${monto}</p>
                    </div>
                    <button onClick={handleConfirm} className="btn btn-primary mt-3 btn-continuar">
                        Realizar Seña
                    </button>
                    <span>Mensaje</span>
                </div>
            </div>
        </div>
    );
};

export default CardInfoReserva;