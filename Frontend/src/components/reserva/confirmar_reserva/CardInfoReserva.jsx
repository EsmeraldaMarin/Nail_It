import React from 'react';
import './CardInfoReserva.scss';

const CardInfoReserva = ({ setPasoActual, allReservas, comprobante, setComprobante, registrarReserva, modificarReserva }) => {

    // Traer de BD
    const alias = "hola.como.estas";
    const cbu = "0800056663332225";
    const titularCuenta = "Maria Jose Apellido";

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        setComprobante(selectedFile)
    };

    const handleConfirm = () => {
        if (comprobante) {
            registrarReserva();
        }
        setPasoActual(3);
    };

    return (
        <div className="container">
            <h5 className="mb-4">Información sobre tu reserva</h5>

            <div className="card shadow-sm p-4 mb-4">
                {allReservas.map((reserva, index) => (
                    <div key={index}>
                        <div className="d-flex justify-content-between align-items-center border-bottom pb-3 mb-3">
                            <p className="mb-0">
                                Reserva para: <span className="fw-bold servicio">{reserva.servicio_data.nombre}</span>
                            </p>
                        </div>
                        <div className="mb-3">
                            <div className="d-flex justify-content-between">
                                <p className="fw-bold mb-0">Profesional</p>
                                <p className="text-end mb-0">{reserva.profesional_data.nombre}</p>
                            </div>
                            <div className="d-flex justify-content-between">
                                <p className="fw-bold mb-0">Fecha</p>
                                <p className="text-end mb-0">{reserva.fecha}</p>
                            </div>
                            <div className="d-flex justify-content-between">
                                <p className="fw-bold mb-0">Horario</p>
                                <p className="text-end mb-0">{reserva.horario} hs</p>
                            </div>
                            <button className='btn btn-warning' onClick={() => { modificarReserva(index) }}>Modificar reserva</button>
                        </div>
                    </div>
                ))
                }
                <div className="mb-4">
                    <p className="fw-bold mb-1">Importe de seña a abonar</p>
                    <p className="fs-5">$ corregirr</p>
                </div>

                <button
                    className="btn btn-warning w-100 mb-3"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapseExample"
                    aria-expanded="false"
                    aria-controls="collapseExample"
                >
                    Ver datos para pago de seña <i className="bi bi-chevron-down"></i>
                </button>

                <div className="collapse" id="collapseExample">
                    <div className="card card-body">
                        <div className="text-center">
                            <p>Alias para Transferencia</p>
                            <strong className="d-block mb-2">{alias}</strong>
                            <p>CBU para Transferencia</p>
                            <strong className="d-block mb-2">{cbu}</strong>
                            <p>Titular de Cuenta</p>
                            <strong className="d-block mb-4">{titularCuenta}</strong>

                        </div>
                    </div>
                </div>
                <div className="mb-3">
                    <label htmlFor="formFile" className="form-label">Adjunte su comprobante</label>
                    <input className="form-control" type="file" id="formFile" onChange={handleFileChange} />
                </div>

                <button
                    onClick={handleConfirm}
                    className="btn btn-primary w-100 mt-4"
                    disabled={!comprobante}
                >
                    Listo <i className="bi bi-check"></i>
                </button>
            </div>

            <span className="text-muted">* Mensaje de confirmación aparecerá aquí</span>
        </div>
    );
};

export default CardInfoReserva;
