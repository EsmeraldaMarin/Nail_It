import Registro from "../login/Registro";

function FormCrearEstilista({ modalRef, profesionales, setProfesionales, setFilteredProfesionales }) {
    const handleSubmitAdmin = (newProfesional) => {
        setProfesionales([...profesionales, newProfesional]);
        setFilteredProfesionales([...profesionales, newProfesional]);
        const modalElement = modalRef.current;
        const bootstrapModal = new window.bootstrap.Modal(modalElement);
        bootstrapModal.hide();
    }
    return (
        <div className="modal fade" id="FormCrearEstilista" tabIndex="-1" aria-labelledby="modalLabel" aria-hidden="true" ref={modalRef}>
            <div className="modal-dialog modal-dialog-scrollable">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5" id="modalLabel">Crear Estilista</h1>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body-crear-estilista">
                        <Registro mensajeBoton={"Crear Estilista"} isAdminParam={true} redirect="/inicio_admin/gestion_estilistas" handleSubmitAdmin={handleSubmitAdmin} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default FormCrearEstilista;
