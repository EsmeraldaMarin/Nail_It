import React, { useState, useEffect, useRef } from 'react';
import './Estilistas.scss';
import axios from '../../axiosConfig/axiosConfig';

function EstilistaManager() {
    const [filteredProfesionales, setFilteredProfesionales] = useState([]); // Estilistas filtrados
    const [searchTerm, setSearchTerm] = useState(''); // Término de búsqueda
    const [selectedProfesional, setSelectedProfesional] = useState(null); // Estilista seleccionado para el modal
    const modalRef = useRef(null); // Referencia al modal de Bootstrap
    const [profesionales, setProfesionales] = useState([]);


    useEffect(() => {
        let isMounted = true;
        const fetchProfesionales = async () => {
            try {
                const response = await axios.get(`/admin`);
                if (isMounted) {
                    setProfesionales(response.data);
                    setFilteredProfesionales(response.data); // Mostrar todos al principio
                }
            } catch (error) {
                if (isMounted) console.error('Error al obtener las profesionales', error);
            }
        };
        fetchProfesionales();
        return () => {
            isMounted = false; // Al desmontar, se marca como desmontado
        };
    }, []);


    // Función para manejar la búsqueda
    const handleSearch = (e) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);

        if (term === '') {
            setFilteredProfesionales(profesionales); // Mostrar todos si no hay búsqueda
        } else {
            const filtered = profesionales.filter(profesional =>
                profesional.nombre.toLowerCase().includes(term) ||
                profesional.apellido.toLowerCase().includes(term) ||
                profesional.email.toLowerCase().includes(term)
            );
            setFilteredProfesionales(filtered);
        }
    };

    // Función para abrir el modal con la información del profesional seleccionado
    const handleCardClick = (profesional) => {
        setSelectedProfesional(profesional);

        // Mostrar el modal usando la API de Bootstrap
        const modalElement = modalRef.current;
        const bootstrapModal = new window.bootstrap.Modal(modalElement);
        bootstrapModal.show();
    };

    return (
        <div className="container">
            <h3>Gestor de Estilistas</h3>
            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Buscar por nombre, apellido o email"
                    value={searchTerm}
                    onChange={handleSearch}
                    className="search-input"
                />
            </div>
            {/* Modal para mostrar y editar los detalles del estilista */}
            <div className="modal fade" id="estilistaModal" tabIndex="-1" aria-labelledby="modalLabel" aria-hidden="true" ref={modalRef}>
                <div className="modal-dialog modal-dialog-scrollable">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="modalLabel">Detalles de la Estilista</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            {selectedProfesional && (
                                <>
                                    <p><strong>Nombre:</strong> {selectedProfesional.nombre} {selectedProfesional.apellido}</p>
                                    <p><strong>Email:</strong> {selectedProfesional.email}</p>
                                    <p><strong>Horarios:</strong> { }</p>
                                    {/* Aquí puedes agregar los horarios y otras opciones */}
                                </>
                            )}
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                            <button type="button" className="btn btn-primary">Actualizar</button>
                            <button type="button" className="btn btn-danger">Eliminar</button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card-container">
                {filteredProfesionales.length === 0 ? (
                    <p>No se encontraron estilistas.</p>
                ) : (
                    filteredProfesionales.map((estilista) => (
                        <button key={estilista.id} className="card" onClick={() => handleCardClick(estilista)}>
                            <h2>{estilista.nombre} {estilista.apellido}</h2>
                            <p>{estilista.email}</p>
                            <p>Horarios: { }</p>
                        </button>
                    ))
                )}
            </div>


        </div>
    );
}

export default EstilistaManager;
