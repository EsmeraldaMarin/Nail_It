import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import React, { useState, useEffect } from 'react';
import axios from '../../axiosConfig/axiosConfig';
import { useNavigate } from 'react-router-dom';
import "./Historial.scss"
import { Modal } from 'react-bootstrap'

const Historial_turnos = () => {
    const [reservas, setReservas] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [reservaParaCancelar, setReservaParaCancelar] = useState(null);
    const userId = localStorage.getItem('userId');
    const cbuUser = ""
    const navigate = useNavigate();
    const [cbu, setCbu] = useState("");
    const [showCBUModal, setShowCBUModal] = useState(false);

    const handleCancelacion = async (id, reservaData, estado, cbu = null) => {
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
                    cbu: cbu // Agrega el CBU al cliente
                });
            }


            if (result.status === 200) {
                const response = await axios.get(`/reserva/user/${userId}`);
                setReservas(response.data);
                setShowModal(false);
                setReservaParaCancelar(null);
            }
        } catch (error) {
            console.error('Error al actualizar la reserva:', error);
        }
    };

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

    const onActualizar = async (id, reservaData) => {
        setReservaParaCancelar({ id, reservaData });
        if (calcularDiferenciaHoras(reservaData.fecha) < 48) {
            setShowModal(true);
        } else {
            setShowCBUModal(true); // Muestra el nuevo modal si faltan más de 48 horas
        }
    };

    const handleCBUChange = (event) => {
        setCbu(event.target.value); // Actualiza el estado cbuUser con el valor ingresado
    }
    const handleCBUModalConfirm = async () => {
        // Verifica el CBU y envía la solicitud de cancelación


        try {
            await handleCancelacion(reservaParaCancelar.id, reservaParaCancelar.reservaData, "por_reembolsar", cbu);
            setShowCBUModal(false);

        } catch (error) {
            console.error('Error al cancelar con devolución de seña:', error);
        }
    };
    const handleModalConfirm = () => {
        if (reservaParaCancelar) {
            handleCancelacion(reservaParaCancelar.id, reservaParaCancelar.reservaData, "cancelada");
        }
    };

    useEffect(() => {
        const fetchReservas = async () => {
            try {
                const response = await axios.get(`/reserva/user/${userId}`);
                setReservas(response.data);
                const clientResponse = await axios.get(`/cliente/${userId}`);
                if (clientResponse.data && clientResponse.data.cbu) {
                    setCbu(clientResponse.data.cbu)
                    cbuUser = clientResponse.data.cbu
                }
            } catch (error) {
                console.error('Error al obtener las reservas', error);
            }
        };
        fetchReservas();
    }, []);

    const obtenerClasesCard = (estado) => {
        switch (estado) {
            case 'cancelada':
                return {
                    card: 'card border-danger mb-3',
                    header: 'card-header bg-transparent border-danger',
                    footer: 'card-footer bg-transparent border-danger',
                };
            case 'pendiente':
                return {
                    card: 'card border-warning mb-3',
                    header: 'card-header bg-transparent border-warning',
                    footer: 'card-footer bg-transparent border-warning',
                };
            case 'confirmada':
                return {
                    card: 'card border-success mb-3',
                    header: 'card-header bg-transparent border-success',
                    footer: 'card-footer bg-transparent border-success',
                };
            default:
                return {
                    card: 'card border-secondary mb-3',
                    header: 'card-header bg-transparent border-secondary',
                    footer: 'card-footer bg-transparent border-secondary',
                };
        }
    };

    const renderFilasReservas = (reservas) => {
        return (
            <div className="row">
                {reservas.map((reserva, index) => {
                    const clases = obtenerClasesCard(reserva.estado);

                    return (
                        <div className="col-sm-12 col-md-6 col-lg-4" key={index}>
                            <div className={clases.card} style={{ maxWidth: '18rem' }}>
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
                                        <li className="list-group-item"><strong>Estilista:</strong> {reserva.Admin.nombre}</li>
                                        <li className="list-group-item"><strong>Fecha:</strong> {formatearFecha(reserva.fecha)}</li>
                                        <li className="list-group-item"><strong>Hora de Inicio:</strong> {reserva.horaInicio}</li>
                                        <li className="list-group-item"><strong>Importe de la seña:</strong> {reserva.montoSenia}</li>
                                        <li className="list-group-item"><strong>Importe Total:</strong> ${reserva.montoTotal}</li>
                                        <li className="list-group-item"><strong>Servicio:</strong> {reserva.Servicio.nombre}</li>
                                        <li className="list-group-item"><strong>Especialidad del Servicio:</strong> {reserva.Servicio.Especialidad.nombre}</li>
                                    </ul>
                                </div>
                                <div className={clases.footer + " text-uppercase"}>
                                    {reserva.estado === 'pendiente' ? 'Pendiente de confirmar seña' :
                                        reserva.estado === 'por_reembolsar' ? 'pendiente de reembolso' :
                                            reserva.estado}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    const handleRedirect = () => {
        navigate('/inicio');
    };

    const dividirReservas = (reservas) => {
        const fechaActual = new Date();
        const reservasPasadas = reservas.filter(reserva => new Date(reserva.fecha) < fechaActual);
        const reservasFuturas = reservas.filter(reserva => new Date(reserva.fecha) >= fechaActual).reverse();
        return { reservasPasadas, reservasFuturas };
    };

    const { reservasPasadas, reservasFuturas } = dividirReservas(reservas);

    return (
        <div className='body-ctn'>
            <div className='container-fluid Reservas'>
                <h4>Mis Reservas</h4>
                {reservasFuturas.length > 0 ? renderFilasReservas(reservasFuturas) : <p>No tienes reservas próximas.</p>}
                <h4>Mis Reservas anteriores</h4>
                {reservasPasadas.length > 0 ? renderFilasReservas(reservasPasadas) : <p>No tienes reservas pasadas.</p>}
            </div>
            <div>
                <button className='btn misTurnos-btn' onClick={handleRedirect}>
                    <i className='bi bi-arrow-left pe-2'></i> Volver
                </button>
            </div>
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton className="custom-modal-header">
                    <Modal.Title className="modal-title-custom">Cancelar reserva</Modal.Title>
                </Modal.Header>
                <Modal.Body className="modal-body-custom">
                    <div className="modal-content-wrapper">
                        <p className="modal-message">
                            Debido a que faltan menos de 48 horas para su turno, su seña no será devuelta.
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
                            <label htmlFor="cbu">Ingrese su CBU para el reembolso:</label>
                            <input
                                type="text"
                                id="cbu"
                                className="form-control"
                                value={cbu}
                                onChange={handleCBUChange}

                            />
                        </div>
                        <div className="modal-buttons mt-3">
                            <button className="btn btn-danger confirm-btn" onClick={handleCBUModalConfirm}>Confirmar cancelación</button>
                            <button className="btn btn-secondary cancel-btn" onClick={() => setShowCBUModal(false)}>Conservar mi reserva</button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>

        </div>
    );
}

export default Historial_turnos;
