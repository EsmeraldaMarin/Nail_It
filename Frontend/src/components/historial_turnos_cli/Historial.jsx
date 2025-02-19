import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import React, { useState, useEffect } from 'react';
import axios from '../../axiosConfig/axiosConfig';
import { useNavigate } from 'react-router-dom';
import "./Historial.scss"
import { Modal } from 'react-bootstrap'

const Historial_turnos = () => {
    const [reservas, setReservas] = useState([]);
    const [reservasFiltradas, setReservasFiltradas] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [reservaParaCancelar, setReservaParaCancelar] = useState(null);
    const userId = localStorage.getItem('userId');
    let cbuUser = ""
    const navigate = useNavigate();
    const [cbu, setCbu] = useState("");
    const [cuenta, setcuenta] = useState("");
    const [showCBUModal, setShowCBUModal] = useState(false);
    const [isValidCBUOrAlias, setIsValidCBUOrAlias] = useState(true)

    // Use effect------------------------------------------------------------------------------------------
    useEffect(() => {
        fetchReservas();
    }, []);

    const fetchReservas = async () => {
        try {
            const response = await axios.get(`/reserva/user/${userId}`);
            //estas reservas son las originales traidas de la BD
            setReservas(response.data);
            //este arreglo de reservas va a ir modificandose segun los filtros
            setReservasFiltradas(response.data);
            const clientResponse = await axios.get(`/cliente/${userId}`);
            if (clientResponse.data && clientResponse.data.cbu) {
                setCbu(clientResponse.data.cbu)
                setcuenta(clientResponse.data.titular_cuenta)
                cbuUser = clientResponse.data.cbu
            }

        } catch (error) {
            console.error('Error al obtener las reservas', error);
        }
    };

    // handles---------------------------------------------------------------------------------------------
    const handleCancelacion = async (id, reservaData, estado, cbu = null, cuenta = null) => {
        try {
            const result = await axios.put(`/reserva/${id}`, {
                ...reservaData,
                estado
            });
            if (cbu != cbuUser) {
                const user = await axios.get(`/cliente/${userId}`);
                const result2 = await axios.put(`/cliente/${userId}`, {
                    nombre: user.data.nombre,
                    apellido: user.data.apellido,
                    numero: user.data.numero,
                    email: user.data.email,
                    verificado: user.data.verificado,
                    cbu: cbu, // Agrega el CBU al cliente
                    titular_cuenta: cuenta
                });
            }

            if (result) {
                const response = await axios.get(`/reserva/user/${userId}`);
                fetchReservas();
                setShowModal(false);
                setReservaParaCancelar(null);
            }
        } catch (error) {
            console.error('Error al actualizar la reserva:', error);
        }
    };
    const onActualizar = async (id, reservaData) => {
        setReservaParaCancelar({ id, reservaData });
        if (calcularDiferenciaHoras(reservaData.fecha) < 48) {
            setShowModal(true);
        } else {
            setShowCBUModal(true); // Muestra el nuevo modal si faltan más de 48 horas
        }
    };
    const handleCBUChange = (event) => {
        const input = event.target.value;
        setCbu(input);
        setIsValidCBUOrAlias(validateCBUOrAlias(input))
    }
    const handleCuentaChange = (event) => {
        setcuenta(event.target.value);
    };
    const handleCBUModalConfirm = async () => {
        if (isValidCBUOrAlias) {
            try {
                await handleCancelacion(reservaParaCancelar.id, reservaParaCancelar.reservaData, "por_reembolsar", cbu, cuenta);
                setShowCBUModal(false);
            } catch (error) {
                console.error('Error al cancelar con devolución de seña:', error);
            }
        }
    };
    const handleModalConfirm = () => {
        if (reservaParaCancelar) {
            handleCancelacion(reservaParaCancelar.id, reservaParaCancelar.reservaData, "cancelada");
        }
    };
    const handleRedirect = () => {
        navigate('/inicio');
    };
    const handleFilterChange = (e) => {
        if (e.target.value == "todas") {
            setReservasFiltradas(reservas)
            return
        }
        const reservasFiltradas = reservas.filter(reserva => reserva.estado === e.target.value);
        setReservasFiltradas(reservasFiltradas)
    }

    // formato y funciones de soporte----------------------------------------------------------------------
    const formatearFecha = (fecha) => {
        const fechaLocal = new Date(new Date(fecha).getTime() + new Date().getTimezoneOffset() * 60000);
        return format(fechaLocal, 'EEEE dd/MM', { locale: es });
    };
    const calcularDiferenciaHoras = (fechaReserva) => {
        const fechaActual = new Date();
        const diferenciaMilisegundos = new Date(fechaReserva) - fechaActual;
        const diferenciaHoras = diferenciaMilisegundos / (1000 * 60 * 60);
        return diferenciaHoras;
    };
    const validateCBUOrAlias = (value) => {
        if (!value) return false; // Evita valores null, undefined o vacíos
        value = value.trim(); // Elimina espacios innecesarios
    
        const esCBU = /^\d{22}$/.test(value);
        const esAlias = /^(?!.*\.\.)(?!^\.)[a-zA-Z0-9.]{6,20}(?<!\.)$/.test(value);
    
        return esCBU || esAlias;
    };
    
    const obtenerClasesCard = (estado) => {
        switch (estado) {
            case 'cancelada':
                return {
                    card: 'cardd card-danger',
                    header: 'card-header',
                    footer: 'card-footer',
                };
            case 'pendiente':
                return {
                    card: 'cardd card-warning',
                    header: 'card-header',
                    footer: 'card-footer',
                };
            case 'por_reembolsar':
                return {
                    card: 'cardd card-warning2',
                    header: 'card-header',
                    footer: 'card-footer',
                };
            case 'confirmada':
                return {
                    card: 'cardd card-success',
                    header: 'card-header',
                    footer: 'card-footer',
                };
            default:
                return {
                    card: 'cardd card-secondary',
                    header: 'card-header',
                    footer: 'card-footer',
                };
        }
    };
    const dividirReservas = (reservas) => {
        const fechaActual = new Date();
        const reservasPasadas = reservas.filter(reserva => new Date(reserva.fecha) < fechaActual);
        const reservasFuturas = reservas.filter(reserva => new Date(reserva.fecha) >= fechaActual).reverse();
        return { reservasPasadas, reservasFuturas };
    };
    const { reservasPasadas, reservasFuturas } = dividirReservas(reservasFiltradas);

    // renders --------------------------------------------------------------------------------------------
    const renderFilasReservas = (reservas) => {
        return (
            <div className="row">
                {reservas.map((reserva, index) => {
                    const clases = obtenerClasesCard(reserva.estado);

                    return (
                        <div className="col-sm-12 col-md-6 col-lg-4" key={index}>
                            <div className={clases.card}>
                                <div className={clases.header}>
                                    Turno {reserva.Servicio.Especialidad.nombre}
                                    {
                                        (reserva.estado === 'pendiente' || reserva.estado === 'confirmada') && (
                                            <button className="btn btn-danger btn-sm ms-4" onClick={() => onActualizar(reserva.id, reserva)}>
                                                Cancelar
                                            </button>
                                        )}
                                </div>
                                <div className="card-body text-success">
                                    <ul className="list-group list-group-flush">
                                        <li className="list-group-item"><strong>Operadora:</strong> {reserva.Admin.nombre}</li>
                                        <li className="list-group-item"><strong>Fecha:</strong> <span className="text-capitalize">{formatearFecha(reserva.fecha)}</span> - <strong>Hora de Inicio:</strong> {reserva.horaInicio}hs</li>
                                        <li className="list-group-item"><strong>Importe de la seña:</strong> ${reserva.montoSenia} - <strong>Importe Total:</strong> ${reserva.montoTotal}</li>
                                        <li className="list-group-item"><strong>Servicio:</strong> {reserva.Servicio.nombre}</li>
                                        <li className="list-group-item"><strong>Especialidad del Servicio:</strong> {reserva.Servicio.Especialidad.nombre}</li>
                                    </ul>
                                </div>
                                <div className={clases.footer + " text-uppercase"}>
                                    {reserva.estado === 'pendiente' ? 'Pendiente de confirmar seña' :
                                        reserva.estado === 'por_reembolsar' ? 'pendiente de reembolso' :
                                            reserva.estado === 'no_realizada' ? 'No realizada por ausencia' :
                                                reserva.estado}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <div className='body-ctn'>
            <div className='d-flex justify-content-between mb-3 align-items-center'>
                <div>
                    <button className='btn misTurnos-btn m-0' onClick={handleRedirect}>
                        <i className='bi bi-arrow-left pe-2'></i> Volver
                    </button>
                </div>
                <div>
                    <select className="form-select" name="estado" id="filtro_estado" onChange={handleFilterChange}>
                        <option value="todas">Todas</option>
                        <option value="confirmada">Confirmada</option>
                        <option value="pendiente">Pendiente de Confirmación</option>
                        <option value="por_reembolsar">Pendiente de Reembolso</option>
                        <option value="realizada">Realizada</option>
                        <option value="no_realizada">No Realizada</option>
                        <option value="cancelada">Cancelada</option>
                    </select>
                </div>
            </div>
            <div className='container-fluid Reservas'>
                <h4>Mis Reservas</h4>
                {reservasFuturas.length > 0 ? renderFilasReservas(reservasFuturas) : <p>No tienes reservas próximas.</p>}
                <h4>Mis Reservas pasadas</h4>
                {reservasPasadas.length > 0 ? renderFilasReservas(reservasPasadas) : <p>No tienes reservas pasadas.</p>}
            </div>
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton className="custom-modal-header">
                    <i className="bi bi-exclamation-circle text-danger fs-1 me-3"></i>
                    <Modal.Title className="modal-title-custom">Cancelar reserva</Modal.Title>
                </Modal.Header>
                <Modal.Body className="modal-body-custom">
                    <div className="modal-content-wrapper">
                        <p className="modal-message">
                            Debido a que faltan menos de 48 horas para su turno,
                            <br />
                            <strong>su seña NO será devuelta</strong>.
                        </p>
                        <div className="modal-buttons">
                            <button className="btn btn-danger confirm-btn" onClick={handleModalConfirm}>Confirmar cancelación</button>
                            <button className="btn btn-secondary cancel-btn" onClick={() => setShowModal(false)}>Conservar mi reserva</button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
            <Modal show={showCBUModal} onHide={() => setShowCBUModal(false)} centered>
                <Modal.Header closeButton className="custom-modal-header">
                    <Modal.Title className="modal-title-custom">Cancelar reserva</Modal.Title>
                </Modal.Header>
                <Modal.Body className="modal-body-custom">
                    <div className="modal-content-wrapper">
                        <p className="modal-message">
                            Debido a que faltan más de 48 horas para su turno, su seña será devuelta.
                        </p>
                        <div className="form-group mt-3">
                            <label htmlFor="cbu">Ingrese su CBU o Alias para el reembolso:</label>
                            <input
                                type="text"
                                id="cbu"
                                className="form-control"
                                value={cbu}
                                onChange={handleCBUChange}

                            />
                            {!isValidCBUOrAlias && (
                                <small className="text-danger">
                                    El CBU debe tener 22 dígitos, o el alias debe tener de 6 a 20 caracteres alfanuméricos y puntos.
                                </small>
                            )}
                        </div>
                        <div className="form-group mt-3">
                            <label htmlFor="cbu">Ingrese el nombre del titular de la cuenta:</label>
                            <input
                                type="text"
                                id="cuenta"
                                className="form-control"
                                value={cuenta}
                                onChange={handleCuentaChange}

                            />
                        </div>
                        <div className="modal-buttons mt-3">
                            <button className="btn btn-danger confirm-btn" onClick={handleCBUModalConfirm} disabled={!isValidCBUOrAlias}>Confirmar cancelación</button>
                            <button className="btn btn-secondary cancel-btn" onClick={() => setShowCBUModal(false)}>Conservar mi reserva</button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>

        </div>
    );
}

export default Historial_turnos;