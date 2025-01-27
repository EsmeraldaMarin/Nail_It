import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const ModalEnviarMensaje = ({ showModal, handleClose, mensaje, telefono, onEnviar }) => {
  return (
    <Modal show={showModal} onHide={handleClose} centered style={{fontSize:"1.3em"}}>
      <Modal.Header>
        <Modal.Title>¡Operación Exitosa!</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>¿Quieres enviar el siguiente mensaje al número: {telefono}?</p>
        <p><strong>{mensaje}</strong></p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          No enviar
        </Button>
        <Button variant="success" onClick={() => onEnviar()}>
          Enviar Mensaje
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalEnviarMensaje;
