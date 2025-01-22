import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const ModalEnviarMensaje = ({ showModal, handleClose, mensaje, telefono, onEnviar }) => {
  return (
    <Modal show={showModal} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Confirmar Envío de Mensaje</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>¿Quieres enviar el siguiente mensaje a {telefono}?</p>
        <p><strong>{mensaje}</strong></p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={() => onEnviar()}>
          Enviar Mensaje
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalEnviarMensaje;
