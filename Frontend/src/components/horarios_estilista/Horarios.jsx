import React, { useState, useEffect } from "react";
import "./Horarios.scss";
import axios from '../../axiosConfig/axiosConfig';

export default function Horarios() {
    const [tiposServicio, setTiposServicio] = useState([])
    const [tipoServicioSeleccionado, setTipoServicioSeleccionado] = useState("")
    const [diaSeleccionado, setDiaSeleccionado] = useState('')

    const horarios = [
        {
            dia: "lunes",
            hora_desde: "8:00",
            hora_hasta: "12:00",
            id_tipo_servicio: 1
        },
        {
            dia: "lunes",
            hora_desde: "8:00",
            hora_hasta: "12:00",
            id_tipo_servicio: 2
        },
        {
            dia: "martes",
            hora_desde: "8:00",
            hora_hasta: "12:00",
            id_tipo_servicio: 2
        },
        {
            dia: "martes",
            hora_desde: "12:00",
            hora_hasta: "15:00",
            id_tipo_servicio: 2
        },
    ];

    useEffect(() => {
        const fetchTiposServicio = async () => {
            try {
                const response = await axios.get(`/especialidad`);
                setTiposServicio(response.data);
            } catch (error) {
                console.error('Error al obtener los tipos de servicio', error);
            }
        };
        fetchTiposServicio();
    }, []);

    // Función para obtener la clase CSS con animaciones
    const obtenerClaseHorarios = () => {
        let entre = horarios.some(h => h.dia === diaSeleccionado);
        return entre ? "horarios_detalle activo" : "horarios_detalle";
    };

    // Filtrar los horarios por el día seleccionado
    const horariosFiltrados = horarios.filter(h => h.dia === diaSeleccionado);

    return (
        <div className="ctn-horarios">
            <h3>Tus horarios</h3>
            <div className="form-horario-atencion">
                <div className="heads">
                    <button value="lunes" onClick={(e) => setDiaSeleccionado(e.target.value)}>Lunes</button>
                    <button value="martes" onClick={(e) => setDiaSeleccionado(e.target.value)}>Martes</button>
                    <button value="miercoles" onClick={(e) => setDiaSeleccionado(e.target.value)}>Miercoles</button>
                    <button value="jueves" onClick={(e) => setDiaSeleccionado(e.target.value)}>Jueves</button>
                    <button value="viernes" onClick={(e) => setDiaSeleccionado(e.target.value)}>Viernes</button>
                    <button value="sabado" onClick={(e) => setDiaSeleccionado(e.target.value)}>Sabado</button>
                    <button value="domingo" onClick={(e) => setDiaSeleccionado(e.target.value)}>Domingo</button>
                </div>
                <div className="body">
                    <div className={obtenerClaseHorarios()}>
                        {horariosFiltrados.length > 0 ? (
                            horariosFiltrados.map((horario, index) => (
                                <p key={index}>- {horario.hora_desde} a {horario.hora_hasta} - {horario.id_tipo_servicio}</p>
                            ))
                        ) : (
                            <p>No tienes horarios registrados</p>
                        )}
                    </div>
                    <hr />
                    <div className="form">
                        <div>
                            <label htmlFor="hora_desde">Hora desde</label>
                            <input className="form-control" id="hora_desde" type="time" />
                        </div>
                        <div>
                            <label htmlFor="hora_hasta">Hora hasta</label>
                            <input className="form-control" id="hora_hasta" type="time" />
                        </div>
                        <div>
                            <label htmlFor="tipo_servicio">Tipo servicio</label>
                            <select
                                value={tipoServicioSeleccionado}
                                id="tipo_servicio"
                                onChange={(e) => {
                                    setTipoServicioSeleccionado(e.target.value);
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
                        <button className="add-horario">
                            <i className="bi bi-plus-circle"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

