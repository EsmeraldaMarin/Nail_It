import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';

function VisualizadorComprobante({ comprobanteURL }) {
    const [showModal, setShowModal] = useState(false);

    // Funciones para abrir y cerrar el modal
    const handleShow = () => setShowModal(true);
    const handleClose = () => setShowModal(false);

    if (!comprobanteURL) {
        return <p>No hay comprobante disponible.</p>;
    }

    return (
        <div>
            {/* Botón para abrir el modal */}
            <a style={{ color: "#000", cursor: "pointer" }} onClick={handleShow}>
                <i className="me-2 bi bi-eye"></i> Ver
            </a>

            {/* Modal para visualizar el comprobante */}
            <Modal show={showModal} onHide={handleClose} size="lg" centered>
                <Modal.Header closeButton>
                    <Modal.Title>Comprobante de Reserva</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div style={{ height: '500px', overflow: "auto" }}>
                        {/*<img 
                            src={comprobanteURL} 
                            width="90%" 
                            height="90%" 
                            title="Comprobante PDF" 
                            style={{ border: 'none' }} 
                        />*/}
                        <iframe
                            src={comprobanteURL}
                            width="100%"
                            height="100%"
                            title="Comprobante PDF"
                            style={{ border: 'none' }}
                        />
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Cerrar
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default VisualizadorComprobante;
