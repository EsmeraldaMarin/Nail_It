import React from 'react';
import './CardInfoReserva.scss';

const CardInfoReserva = ({ esDeEstilista, setPasoActual, reservaData, setReservaData, registrarReserva }) => {
    const { profesional_data, fecha, servicio_data, tipoServicio, horario, precio, monto } = reservaData;
    // Traer de BD
    const alias = "hola.como.estas";
    const cbu = "0800056663332225";
    const titularCuenta = "Maria Jose Apellido";

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        setReservaData({
            ...reservaData,
            comprobante: selectedFile,
        });
    };
    const handleChange = (e) => {
        const { name, value } = e.target;
        setReservaData({
            ...reservaData,
            userId: {
                ...reservaData.userId,
                [name]: value 
            }
        });
    }
    const handleConfirm = () => {
        if (esDeEstilista){
            registrarReserva();
        }
        if (reservaData.comprobante) {
            registrarReserva();
        }
        setPasoActual(3);
    };

    return (
        <div className="container">
            <h5 className="mb-4">Información sobre tu reserva</h5>

            <div className="card shadow-sm p-4 mb-4 info-ctn">
                <div className="d-flex justify-content-between align-items-center border-bottom pb-3 mb-3">
                    <button className="btn btn-outline-secondary rounded-circle" onClick={() => setPasoActual(1)}>
                        <i className="bi bi-chevron-left"></i>
                    </button>
                    <p className="mb-0">
                        Reserva para: <span className="fw-bold servicio">{servicio_data.nombre}</span>
                    </p>
                </div>

                <div className="mb-3">
                    <div className="d-flex justify-content-between">
                        <p className="fw-bold mb-0">Profesional</p>
                        <p className="text-end mb-0">{profesional_data.nombre}</p>
                    </div>
                    <div className="d-flex justify-content-between">
                        <p className="fw-bold mb-0">Fecha</p>
                        <p className="text-end mb-0">{fecha}</p>
                    </div>
                    <div className="d-flex justify-content-between">
                        <p className="fw-bold mb-0">Horario</p>
                        <p className="text-end mb-0">{horario} hs</p>
                    </div>
                </div>

                <div className="mb-4">
                    <p className="fw-bold mb-1">Importe de seña a abonar</p>
                    <p className="fs-5">${reservaData.montoSenia}</p>
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
                {!esDeEstilista &&
                    <div className="mb-3">
                        <label htmlFor="formFile" className="form-label">Adjunte su comprobante</label>
                        <input className="form-control" type="file" id="formFile" onChange={handleFileChange} />
                    </div>
                }
                {
                    esDeEstilista &&
                    <div>
                        <div className="form-group col-md-6">
                            <label className="form-label">Nombre</label>
                            <input
                                type="text"
                                name="nombre_cliente"
                                className="form-control"
                                value={reservaData.userId.nombre_cliente}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group col-md-6">
                            <label className="form-label">Apellido</label>
                            <input
                                type="text"
                                name="apellido_cliente"
                                className="form-control"
                                value={reservaData.userId.apellido_cliente}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group col-md-6">
                            <label className="form-label" >Número de teléfono</label>
                            <input
                                type="tel"
                                name="telefono_cliente"
                                className="form-control"
                                value={reservaData.userId.telefono_cliente}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>
                }
                <button
                    onClick={handleConfirm}
                    className="btn btn-primary w-100 mt-4"
                    disabled={!reservaData.comprobante && !esDeEstilista}
                >
                    Listo <i className="bi bi-check"></i>
                </button>
            </div>

            {/* <span className="text-muted">* Mensaje de confirmación aparecerá aquí</span> */}
        </div>
    );
};

export default CardInfoReserva;
