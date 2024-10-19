import React, { useState, useEffect } from 'react';
import "../Reserva.scss"
import axios from '../../../../axiosConfig/axiosConfig';

const TipoServicio = ({ tipoServicio, setTipoServicio, fetchServicios }) => {
    //esto se trae de la bd
    const [tiposServicio, setTiposServicio] = useState([]);

    // Simulando traer datos de la base de datos
    useEffect(() => {
        const fetchTiposServicio = async () => {
            try {
                const response = await axios.get('/especialidad');
                setTiposServicio(response.data);
            } catch (error) {
                console.error('Error al obtener las tiposServicio', error);
            }
        };
        fetchTiposServicio();
    }, []);

    return (
        <div className="mb-3 tipo-servicio">
            <h5>Seleccione la especialidad</h5>
            <select
                value={tipoServicio == null ? "" : tipoServicio}
                onChange={(e) => {
                    setTipoServicio(e.target.value)
                }}
                className="form-select"

            >
                <option value="">Ninguno</option>
                {tiposServicio.map((tipoServ, index) => (
                    <option key={index} value={tipoServ.id}>
                        {tipoServ.nombre}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default TipoServicio;
