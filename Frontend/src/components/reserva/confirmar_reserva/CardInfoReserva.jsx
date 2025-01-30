import React, { useState } from 'react';
import './CardInfoReserva.scss';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';


const CardInfoReserva = ({ esDeEstilista, setPasoActual, reservaData, setReservaData, registrarReserva }) => {
    const { profesional_data, fecha, servicio_data, tipoServicio, horario, precio, monto } = reservaData;
    // Traer de BD
    const alias = "hola.como.estas";
    const cbu = "0800056663332225";
    const titularCuenta = "Maria Jose Apellido";
    const [viaComprobante, setViaComprobante] = useState('')


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
        if (esDeEstilista) {
            registrarReserva();
        }
        if (reservaData.comprobante) {
            registrarReserva();
        }
        setPasoActual(3);
    };
    const formatearFecha = (fecha) => {
        const fechaLocal = new Date(new Date(fecha).getTime() + new Date().getTimezoneOffset() * 60000);
        return format(fechaLocal, 'EEEE dd/MM', { locale: es });
    };
    const formatPrice = (price) => {
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS',
        }).format(price);
    };

    return (
        <div className="container">
            <h5 className="mb-4">Confirma los datos de tu reserva</h5>

            <div className="card shadow-sm p-4 mb-4 info-ctn">
                <div className="d-flex justify-content-between align-items-center border-bottom pb-3 mb-3">
                    <button className="btn border-black border-2 fw-bolder fs-3 rounded-circle d-flex align-items-center justify-content-center"
                        style={{ width: "30px", height: "30px" }}
                        onClick={() => setPasoActual(1)}>
                        {`<`}
                    </button>
                    <p className="mb-0 ms-3">
                        Reserva para: <span className="fw-bold servicio">{servicio_data.nombre}</span>
                    </p>
                </div>

                <div className="mb-3">
                    <div className="d-flex justify-content-between">
                        <p className="fw-bold mb-0">Profesional</p>
                        <p className="text-end mb-0">{profesional_data.nombre} {profesional_data.apellido}</p>
                    </div>
                    <div className="d-flex justify-content-between">
                        <p className="fw-bold mb-0">Fecha</p>
                        <p className="text-end mb-0 text-capitalize">{formatearFecha(fecha)}</p>
                    </div>
                    <div className="d-flex justify-content-between">
                        <p className="fw-bold mb-0">Horario</p>
                        <p className="text-end mb-0">{horario} hs</p>
                    </div>
                </div>

                <div className="mb-4 text-end">
                    <p className="fw-bold mb-1">Importe de seña a transferir</p>
                    <p className="fs-1 fw-bold">{formatPrice(reservaData.montoSenia)}</p>
                </div>

                <button
                    className="btn btn-success w-100 mb-3"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapseExample"
                    aria-expanded="false"
                    aria-controls="collapseExample"
                >Ver datos para pago de seña</button>

                <div className="collapse" id="collapseExample">
                    <div className="card card-body">
                        <div className="text-center">
                            <p className='text-decoration-underline'>Alias para Transferencia</p>
                            <strong className="d-block mb-2 fs-5">{alias}</strong>
                            <p className='text-decoration-underline'>CBU para Transferencia</p>
                            <strong className="d-block mb-2 fs-5">{cbu}</strong>
                            <p className='text-decoration-underline'>Titular de Cuenta</p>
                            <strong className="d-block fs-5">{titularCuenta}</strong>

                        </div>
                    </div>
                </div>


                {!esDeEstilista &&
                    <div className='my-4'>
                        <p className='mb-3'>¿Cómo desea enviar su comprobante?</p>
                        <div className="form-check mb-3">
                            <input onChange={(e) => setViaComprobante(e.target.value)} className="form-check-input" type="radio" value="wpp" name="flexRadioDefault" id="flexRadioDefault1" />
                            <label className="form-check-label" htmlFor="flexRadioDefault1">
                                Enviar por Whatsapp
                            </label>
                        </div>
                        <div className="form-check">
                            <input onChange={(e) => setViaComprobante(e.target.value)} className="form-check-input" type="radio" value="nailit" name="flexRadioDefault" id="flexRadioDefault12" />
                            <label className="form-check-label" htmlFor="flexRadioDefault12">
                                Adjuntar Aquí
                            </label>
                        </div>
                        {viaComprobante !== 'wpp' &&
                            <div className='mt-4'>
                                <label htmlFor="formFile" className="form-label">Adjunte su comprobante</label>
                                <input className="form-control" type="file" id="formFile" onChange={handleFileChange} />
                            </div>
                        }

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
                    className={`btn w-100 ${viaComprobante === 'wpp' ? 'btn-success' : 'btn-primary'}`}
                    disabled={!reservaData.comprobante && !esDeEstilista && viaComprobante !== 'wpp'}
                >
                    {viaComprobante === 'wpp' ? 'Ir a Whatsapp' : 'Listo'}
                    <i className={`ms-3 bi ${viaComprobante === 'wpp' ? 'bi-whatsapp' : 'bi-check'}`}></i>
                </button>
            </div>

            {/* <span className="text-muted">* Mensaje de confirmación aparecerá aquí</span> */}
        </div >
    );
};

export default CardInfoReserva;
