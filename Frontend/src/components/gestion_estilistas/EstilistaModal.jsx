function EstilistaModal({
    selectedProfesional,
    estilistaData,
    setEstilistaData,
    modalRef,
    modoConsulta,
    handleModificarClick,
    handleGuardarCambios,
    showSuccessMessage
}) {
    return (
        <div className="modal fade" id="estilistaModal" tabIndex="-1" aria-labelledby="modalLabel" aria-hidden="true" ref={modalRef}>
            <div className="modal-dialog modal-dialog-scrollable">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5" id="modalLabel">Detalles de la Operadora</h1>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={() => { handleModificarClick }}></button>
                    </div>
                    <div className="modal-body">
                        {selectedProfesional && (
                            <div className="info-estilista">
                                {showSuccessMessage && (
                                    <div className="alert alert-success" role="alert">
                                        Información actualizada con éxito.
                                    </div>
                                )}
                                <div>
                                    <label htmlFor="">Nombre:</label>
                                    <input type="text" disabled={modoConsulta} value={estilistaData.nombre} onChange={(e) => setEstilistaData({ ...estilistaData, nombre: e.target.value })} />
                                </div>
                                <div>
                                    <label htmlFor="">Apellido:</label>
                                    <input type="text" disabled={modoConsulta} value={estilistaData.apellido} onChange={(e) => setEstilistaData({ ...estilistaData, apellido: e.target.value })} />
                                </div>
                                <div>
                                    <label htmlFor="">Email:</label>
                                    <input type="email" disabled={modoConsulta} value={estilistaData.email} onChange={(e) => setEstilistaData({ ...estilistaData, email: e.target.value })} />
                                </div>
                                <div>
                                    <label htmlFor="">Telefono:</label>
                                    <input type="number" disabled={modoConsulta} value={estilistaData.numero} onChange={(e) => setEstilistaData({ ...estilistaData, numero: e.target.value })} />
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="modal-footer">
                        {modoConsulta && <button type="button" className="btn btn-danger">Eliminar Usuario</button>}
                        {!modoConsulta && <button type="button" className="btn btn-danger" onClick={() => {
                            setEstilistaData({
                                id: selectedProfesional.id,
                                nombre: selectedProfesional.nombre,
                                apellido: selectedProfesional.apellido,
                                email: selectedProfesional.email,
                                numero: selectedProfesional.numero,
                            });
                            handleModificarClick()
                        }}>Cancelar Cambios</button>}
                        {modoConsulta && <button type="button" className="btn btn-primary" onClick={handleModificarClick}>Modificar Usuario</button>}
                        {!modoConsulta && <button type="button" className="btn btn-primary" onClick={handleGuardarCambios}>Guardar Cambios</button>}
                        {modoConsulta && <button type="button" className="btn btn-success" data-bs-dismiss="modal" aria-label="Close" onClick={() => { handleModificarClick }}>Listo</button>}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EstilistaModal;
