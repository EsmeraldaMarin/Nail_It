import { Modal } from 'react-bootstrap'
import React, { useState, useEffect } from 'react';
import VisualizadorComprobante from './subComponentes/VisualizadorComprobante';

const ReservasAReembolsar = ({ reservas, handleReembolsoReserva, formatearFecha }) => {

    const userId = localStorage.getItem('userId');
    const reservasReembolso = reservas.filter(
        reserva => reserva.estado === "por_reembolsar" && reserva.id_profesional === userId

    );
    console.log(reservasReembolso)

    const [selectedReserva, setSelectedReserva] = useState(null)
    const [showModal, setShowModal] = useState(false);

    const openModal = (reserva) => {
        setSelectedReserva(reserva);
        setShowModal(true);
    };
    const closeModal = () => {
        setSelectedReserva(null);
        setShowModal(false);
    };

    const confirmCancellation = () => {
        if (selectedReserva) {
            handleReembolsoReserva(selectedReserva.id, selectedReserva);
            closeModal();
        }
    };
    const formatPrice = (price) => {
        if (typeof price === "string") {
            price = parseFloat(price.replace(",", "."));
        }
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS',
            minimumFractionDigits: 2, 
            maximumFractionDigits: 2,
        }).format(price);
    };
    return (
        <div>
            <h4 className="py-3">Reservas pendientes de reembolsar</h4>

            <div className="table-ctn pb-2 reservas-pendientes a-reembolsar" >
                <div className="table-responsive">
                    <table className="table">
                        <thead className="table-light">
                            <tr>
                                <th scope="col">Nombre Cliente</th>
                                <th scope="col">Teléfono</th>
                                <th scope="col">Fecha Turno</th>
                                <th scope="col">Hora Turno</th>
                                <th scope="col">CBU o Alias</th>
                                <th scope="col">Titular de la cuenta</th>
                                <th scope="col" >A reembolsar</th>
                                <th scope="col" >Comprobante</th>
                                <th scope="col">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reservasReembolso.length > 0 ?
                                reservasReembolso.map((reserva, index) =>
                                    <tr key={index}>
                                        <td className="text-capitalize">{reserva.Cliente ? reserva.Cliente.nombre : reserva.nombre_cliente} {reserva.Cliente ? reserva.Cliente.apellido : reserva.apellido_cliente}</td>
                                        <td className='text-center'>
                                            <a
                                                className='wpp-btn'
                                                href={`https://wa.me/${reserva.Cliente ? reserva.Cliente.numero : reserva.telefono_cliente}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                style={{ color: "#000", textDecoration: "none" }}
                                            >
                                                <i className="bi bi-whatsapp" style={{ color: "green" }}> </i>
                                            </a>
                                            <span className='display-on-hover'>{reserva.Cliente ? reserva.Cliente.numero : reserva.telefono_cliente}</span>
                                        </td>
                                        <td className="text-capitalize">{formatearFecha(reserva.fecha)}</td>
                                        <td>{reserva.horaInicio}</td>
                                        <td><input class="form-control" type="text" value={reserva.Cliente?.cbu || "-"} aria-label="readonly input example" disabled readonly /></td>
                                        <td><input class="form-control" type="text" value={reserva.Cliente?.titular_cuenta || "-"} aria-label="readonly input example" disabled readonly /></td>
                                        <td><strong>{formatPrice(reserva.montoSenia)}</strong></td>
                                        <td className='visualizar-btn'>
                                            {reserva.Cliente && reserva.comprobante != "sin comprobante" ? <VisualizadorComprobante comprobanteURL={reserva.comprobante} />
                                                : <a
                                                    className='fs-6'
                                                    href={`https://wa.me/${reserva.Cliente ? reserva.Cliente.numero : reserva.telefono_cliente}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    style={{ color: "#000", textDecoration: "none" }}
                                                >
                                                    <i className="bi bi-box-arrow-up-right">  Ver Whatsapp </i>
                                                </a>}
                                        </td>
                                        <td>
                                            {
                                                <div>
                                                    <button className="btn btn-danger" onClick={() => openModal(reserva)}>
                                                        Reembolsado
                                                    </button>

                                                </div>
                                            }

                                        </td>
                                    </tr>
                                )
                                : <tr><td colSpan="6">No hay reservas pendientes de reembolso</td></tr>}


                        </tbody>
                    </table>
                </div>
            </div>
            {/* Modal for confirming reservation cancellation */}
            <Modal show={showModal} onHide={closeModal} centered>
                <Modal.Header closeButton className="custom-modal-header">
                    <Modal.Title className="modal-title-custom">Cancelar reserva</Modal.Title>
                </Modal.Header>
                <Modal.Body className="modal-body-custom">
                    <div className="modal-content-wrapper">
                        <p className="modal-message">
                            Está confirmando la cancelación de la reserva. Asegúrese de haber reembolsado la seña.
                        </p>
                        <div className="modal-buttons">
                            <button className="btn btn-danger confirm-btn" onClick={confirmCancellation}>
                                Confirmar cancelación
                            </button>
                            <button className="btn btn-secondary cancel-btn" onClick={closeModal}>
                                Conservar reserva
                            </button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    )


}


export default ReservasAReembolsar