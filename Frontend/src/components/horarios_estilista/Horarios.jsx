import React, { useState, useEffect } from "react";
import "./Horarios.scss";
import axios from '../../axiosConfig/axiosConfig';

export default function Horarios() {
    const [tiposServicio, setTiposServicio] = useState([])
    const [tipoServicioSeleccionado, setTipoServicioSeleccionado] = useState("")
    const [diaSeleccionado, setDiaSeleccionado] = useState('')
    const [horariosDelProfesional, setHorariosDelProfesional] = useState([])
    useEffect(() => {
        const fetchTiposServicio = async () => {

            const userId = localStorage.getItem('userId');
            try {
                const horarios = await axios.get(`/horario/estilista/${userId}`);
                const response = await axios.get(`/especialidad`);
                setHorariosDelProfesional(horarios.data);
                setTiposServicio(response.data);
            } catch (error) {
                console.error('Error al obtener los tipos de servicio', error);
            }
        };
        fetchTiposServicio();
    }, []);

    // Función para obtener la clase CSS con animaciones
    const obtenerClaseHorarios = () => {
        let entre = horariosDelProfesional.some(h => h.dia_semana === diaSeleccionado);
        return entre ? "horarios_detalle activo" : "horarios_detalle";
    };

    // Filtrar los horarios por el día seleccionado
    const horariosFiltrados = horariosDelProfesional.filter(h => h.dia_semana === diaSeleccionado);

    return (
        <div className="ctn-horarios">
            <h3>Tus horarios</h3>
            <div className="form-horario-atencion">
                <div className="heads">
                    <button value="Lunes" onClick={(e) => setDiaSeleccionado(e.target.value)}>Lunes</button>
                    <button value="Martes" onClick={(e) => setDiaSeleccionado(e.target.value)}>Martes</button>
                    <button value="Miercoles" onClick={(e) => setDiaSeleccionado(e.target.value)}>Miercoles</button>
                    <button value="Jueves" onClick={(e) => setDiaSeleccionado(e.target.value)}>Jueves</button>
                    <button value="Viernes" onClick={(e) => setDiaSeleccionado(e.target.value)}>Viernes</button>
                    <button value="Sabado" onClick={(e) => setDiaSeleccionado(e.target.value)}>Sabado</button>
                    <button value="Domingo" onClick={(e) => setDiaSeleccionado(e.target.value)}>Domingo</button>
                </div>
                <div className="body">
                    <div className={obtenerClaseHorarios()}>
                        {horariosFiltrados.length > 0 ? (
                            horariosFiltrados.map((horario, index) => (
                                <p key={index}>- {horario.hora_inicio} a {horario.hora_fin} - {horario.id_especialidad}</p>
                            ))
                        ) : (
                            <p>No tienes horarios registrados</p>
                        )}
                    </div>
                    <hr />
                    <div className="form">
                        <div>
                            <label htmlFor="hora_inicio">Hora desde</label>
                            <input className="form-control" id="hora_inicio" type="time" />
                        </div>
                        <div>
                            <label htmlFor="hora_fin">Hora hasta</label>
                            <input className="form-control" id="hora_fin" type="time" />
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

