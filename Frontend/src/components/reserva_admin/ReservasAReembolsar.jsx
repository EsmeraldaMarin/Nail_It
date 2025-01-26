import { Modal } from 'react-bootstrap'
import React, { useState, useEffect } from 'react';

const ReservasAReembolsar = ({ reservas, handleReembolsoReserva, formatearFecha }) => {

    const userId = localStorage.getItem('userId');
    const reservasReembolso = reservas.filter(
        reserva => reserva.estado === "por_reembolsar" && reserva.id_profesional === userId

    );

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
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS',
        }).format(price);
    };

    return (
        <div>
            <h4 className="py-3">Reservas pendientes de reembolsar</h4>

            <div className="table-ctn pb-2 reservas-pendientes" >
                <div className="table-responsive">
                    <table className="table">
                        <thead className="table-light">
                            <tr>
                                <th scope="col">Nombre</th>
                                <th scope="col">Teléfono</th>
                                <th scope="col">Fecha Turno</th>
                                <th scope="col">Hora Turno</th>
                                {/*<th scope="col">Comprobante</th> */}
                                <th scope="col">CBU o Alias</th>
                                <th scope="col">Titular de la cuenta</th>
                                <th scope="col" >Importe a reembolsar</th>
                                <th scope="col">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reservasReembolso.map((reserva, index) =>

                                <tr key={index}>
                                    <td className="text-capitalize">{reserva.Cliente.nombre} {reserva.Cliente.apellido}</td>
                                    <td>{reserva.Cliente.numero}</td>
                                    <td className="text-capitalize">{formatearFecha(reserva.fecha)}</td>
                                    <td>{reserva.horaInicio}</td>
                                    {/* <td><a href={reserva.comprobante} target="_blank" rel="noreferrer">
                                        Ver Comprobante
                                        </a></td> */}
                                    <td><strong>{reserva.Cliente.cbu}</strong></td>
                                    <td><strong>{reserva.Cliente.titular_cuenta}</strong></td>
                                    <td><strong>{formatPrice(reserva.montoSenia)}</strong></td>
                                    <td>
                                        {
                                            <div>
                                                <button className="btn btn-danger" onClick={() => openModal(reserva)}>
                                                    Cancelar Reserva
                                                </button>

                                            </div>
                                        }

                                    </td>
                                </tr>
                            )}


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
                            Está confirmando la cancelación de la reserva. Asegúrese de haber devuelto la seña.
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