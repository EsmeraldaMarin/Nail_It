import React, { useState, useEffect, useRef } from 'react';
import './Estilistas.scss';
import axios from '../../axiosConfig/axiosConfig';
import SearchBar from './SearchBar';
import EstilistaCard from './EstilistaCard';
import EstilistaModal from './EstilistaModal';
import FormCrearEstilista from './FormCrearEstilista';

function EstilistaManager() {
    const [filteredProfesionales, setFilteredProfesionales] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedProfesional, setSelectedProfesional] = useState(null);
    const modalRef = useRef(null);
    const modalRefCrearUsuario = useRef(null);
    const [profesionales, setProfesionales] = useState([]);
    const [modoConsulta, setmodoConsulta] = useState(true);
    const [estilistaData, setEstilistaData] = useState({});
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);

    useEffect(() => {
        let isMounted = true;
        const fetchProfesionales = async () => {
            try {
                const response = await axios.get(`/admin`);
                if (isMounted) {
                    setProfesionales(response.data);
                    setFilteredProfesionales(response.data);
                }
            } catch (error) {
                if (isMounted) console.error('Error al obtener las profesionales', error);
            }
        };
        fetchProfesionales();
        return () => {
            isMounted = false;
        };
    }, []);

    const handleSearch = (term) => {
        setSearchTerm(term);
        if (term === '') {
            setFilteredProfesionales(profesionales);
        } else {
            const filtered = profesionales.filter(profesional =>
                profesional.nombre.toLowerCase().includes(term) ||
                profesional.apellido.toLowerCase().includes(term) ||
                profesional.email.toLowerCase().includes(term)
            );
            setFilteredProfesionales(filtered);
        }
    };

    const handleCardClick = (profesional) => {
        setSelectedProfesional(profesional);
        setEstilistaData({
            id: profesional.id,
            nombre: profesional.nombre,
            apellido: profesional.apellido,
            email: profesional.email,
            numero: profesional.numero,
        });
        const modalElement = modalRef.current;
        const bootstrapModal = new window.bootstrap.Modal(modalElement);
        bootstrapModal.show();
    };

    const handleModificarClick = () => {
        setmodoConsulta(!modoConsulta);
    };

    const handleGuardarCambios = async () => {
        try {
            // Llamada a la API para actualizar los datos del estilista
            await axios.put(`/admin/${estilistaData.id}`, estilistaData);

            // Actualizar el estado de profesionales con el estilista modificado
            const updatedProfesionales = profesionales.map(profesional =>
                profesional.id === estilistaData.id ? { ...profesional, ...estilistaData } : profesional
            );

            // Actualizar el estado con la lista modificada
            setProfesionales(updatedProfesionales);
            setFilteredProfesionales(updatedProfesionales); // También actualizar la lista filtrada

            // Mostrar mensaje de éxito
            setShowSuccessMessage(true);
            setTimeout(() => {
                setShowSuccessMessage(false);
            }, 3000);
        } catch (error) {
            console.error('Error al realizar la modificación', error);
        }

        // Cambiar modo de consulta de vuelta a lectura
        setmodoConsulta(true);
    };


    return (
        <div className="ctn container-fluid mt-5">
            <div className="ss d-flex justify-content-between align-items-center">
                <h3>Gestor de Operadoras</h3>
                <button className="btn btn-crear-usuario fs-5" onClick={() => {
                    const modalElement = modalRefCrearUsuario.current;
                    const bootstrapModal = new window.bootstrap.Modal(modalElement);
                    bootstrapModal.show();
                }}>Crear Operadora<i className="bi bi-plus-circle"></i></button>

            </div>
            <div className="search-ctn">
                {/* <SearchBar searchTerm={searchTerm} onSearch={handleSearch} /> */}
                <FormCrearEstilista modalRef={modalRefCrearUsuario} profesionales={profesionales} setProfesionales={setProfesionales} setFilteredProfesionales={setFilteredProfesionales} />
            </div>
            <EstilistaModal
                selectedProfesional={selectedProfesional}
                estilistaData={estilistaData}
                setEstilistaData={setEstilistaData}
                modalRef={modalRef}
                modoConsulta={modoConsulta}
                handleModificarClick={handleModificarClick}
                handleGuardarCambios={handleGuardarCambios}
                showSuccessMessage={showSuccessMessage}
            />

            <div className="card-container mt-4">
                {filteredProfesionales.length === 0 ? (
                    <p>No se encontraron operadoras.</p>
                ) : (
                    filteredProfesionales.map((estilista) => (
                        <EstilistaCard key={estilista.id} estilista={estilista} onClick={handleCardClick} />
                    ))
                )}
            </div>
        </div>
    );
}

export default EstilistaManager;
