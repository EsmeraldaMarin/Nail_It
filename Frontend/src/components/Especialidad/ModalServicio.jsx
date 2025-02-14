import React from "react"
import { Modal } from 'react-bootstrap'


const ModalServicio = ({ showModal, closeModal, title, body, btnLeft, btnRight, confirmOperation }) => {
    return <Modal show={showModal} onHide={closeModal} centered>
        <Modal.Header closeButton className="custom-modal-header">
            <Modal.Title className="modal-title-custom">{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="modal-body-custom">
            <div className="modal-content-wrapper">
                <p className="modal-message fs-4" style={{whiteSpace:"pre-line"}}>
                    {body}
                </p>
                <div className="modal-buttons">
                    {btnLeft &&
                        <button className="fs-5 btn btn-danger confirm-btn" onClick={confirmOperation}>
                            {btnLeft}
                        </button>}

                    <button className="fs-5 btn btn-secondary cancel-btn" onClick={closeModal}>
                        {btnRight}
                    </button>
                </div>
            </div>
        </Modal.Body>
    </Modal>
}
export default ModalServicio;