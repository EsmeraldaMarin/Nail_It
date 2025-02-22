import React from 'react';
import Registro from "../login/Registro";

function FormCrearEstilista({ modalRef, profesionales, setProfesionales, setFilteredProfesionales }) {
    const handleSubmitAdmin = (newProfesional) => {
        // Actualizar las listas de profesionales
        setProfesionales([...profesionales, newProfesional]);
        setFilteredProfesionales([...profesionales, newProfesional]);

        // Cerrar el modal al terminar
        const modalElement = modalRef.current;
        if (modalElement) {
            const bootstrapModal = window.bootstrap.Modal.getInstance(modalElement); // Obtener la instancia existente
            if (bootstrapModal) {
                bootstrapModal.hide(); // Cerrar el modal
            }
        }
    }

    return (
        <div className="modal fade" id="FormCrearEstilista" tabIndex="-1" aria-labelledby="modalLabel" aria-hidden="true" ref={modalRef}>
            <div className="modal-dialog modal-dialog-scrollable">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5" id="modalLabel">Crear Operadora</h1>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body-crear-estilista">
                        {/* Formulario para crear una nueva estilista */}
                        <Registro
                            mensajeBoton={"Crear Operadora"}
                            isAdminParam={true}
                            redirect="/inicio_admin/administracion_general"
                            handleSubmitAdmin={handleSubmitAdmin}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default FormCrearEstilista;
