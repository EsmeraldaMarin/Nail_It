import React, { useState, useEffect } from "react";
import "./Horarios.scss";
import axios from '../../axiosConfig/axiosConfig';

export default function Horarios() {
    const [horarioAtencion, setHorarioAtencion] = useState([])
    const [tiposServicio, setTiposServicio] = useState([])
    const [horariosDelProfesional, setHorariosDelProfesional] = useState([])
    const [botonActivo, setBotonActivo] = useState(null);
    const [mensaje, setMensaje] = useState("");
    const [botonConfirmacion, setBotonConfirmacion] = useState(null);
    const [horarioData, setHorarioData] = useState({
        dia_semana: "",
        hora_inicio: "",
        hora_fin: "",
        id_profesional: "",
        id_especialidad: ""
    })
    useEffect(() => {
        const fetchTiposServicio = async () => {

            const userId = localStorage.getItem('userId');
            setHorarioData({ ...horarioData, id_profesional: userId })
            try {
                const horarios = await axios.get(`/horario/estilista/${userId}`);
                const response = await axios.get(`/especialidad`);
                const { data } = await axios.get(`/variablesGlobales`);
                setHorariosDelProfesional(horarios.data);
                setTiposServicio(response.data);
                setHorarioAtencion([data[0].horario_apertura, data[0].horario_cierre])
            } catch (error) {
                console.error('Error al obtener los tipos de servicio', error);
            }
        };
        fetchTiposServicio();
    }, []);

    // Función para obtener la clase CSS con animaciones
    const obtenerClaseHorarios = () => {
        let entre = horariosDelProfesional.some(h => h.dia_semana === horarioData.dia_semana);
        return entre ? "horarios_detalle activo" : "horarios_detalle";
    };

    // Filtrar los horarios por el día seleccionado
    const horariosFiltrados = horariosDelProfesional.filter(h => h.dia_semana === horarioData.dia_semana);

    const handleAddHorario = async () => {
        const { dia_semana, hora_inicio, hora_fin, id_especialidad } = horarioData;

        // Convertir las horas a formato numérico para comparaciones
        const convertirHoraANumero = (hora) => {
            const [horas, minutos] = hora.split(":").map(Number);
            return horas + minutos / 60;
        };

        const horaInicioNumerica = convertirHoraANumero(hora_inicio);
        const horaFinNumerica = convertirHoraANumero(hora_fin);
        const horarioAtencionDesdeNumerico = convertirHoraANumero(horarioAtencion[0]);
        const horarioAtencionHastaNumerico = convertirHoraANumero(horarioAtencion[1]);

        // Verificar que todos los campos estén completos
        if (!dia_semana || !hora_inicio || !hora_fin || !id_especialidad) {
            setMensaje(<div className="alert alert-warning" role="alert">Por favor, completa todos los campos.</div>)
            return;
        }

        // Verificar que la hora de inicio no sea mayor a la hora de fin
        if (horaInicioNumerica >= horaFinNumerica) {
            setMensaje(<div className="alert alert-danger" role="alert">La hora de inicio no puede ser mayor o igual a la hora de fin. </div>)
            return;
        }

        // Verificar que la hora de inicio y fin estén dentro del rango del horario de atención del local
        if (horaInicioNumerica < horarioAtencionDesdeNumerico || horaFinNumerica > horarioAtencionHastaNumerico) {
            setMensaje(<div className="alert alert-danger" role="alert">El horario debe estar dentro del rango de atención del local ({horarioAtencion[0]} - {horarioAtencion[1]}). </div>)
            return;
        }

        // Si todas las validaciones pasan, enviar el horario
        try {
            const response = await axios.post("/horario", horarioData);
            setMensaje(<div className="alert alert-success" role="alert">Horario agregado con éxito.</div>)

            setHorariosDelProfesional([...horariosDelProfesional, response.data]); // Agregar el nuevo horario a la lista
            setHorarioData({ ...horarioData, hora_inicio: "", hora_fin: "", id_especialidad: "" }); // Limpiar los campos
        } catch (error) {
            setMensaje(<div className="alert alert-danger" role="alert">Hubo un error al agregar el horario.</div>)
            console.error("Error al agregar el horario", error);
        }

    };

    const handleDeleteClick = (id) => {
        setBotonConfirmacion(id); // Establece el ID del horario que el usuario está a punto de confirmar
    };

    const handleConfirmDelete = async (id) => {
        try {
            await axios.delete(`/horario/${id}`);
            setHorariosDelProfesional(horariosDelProfesional.filter(h => h.id !== id));
            setMensaje("Horario eliminado con éxito.");
        } catch (error) {
            console.error("Error al eliminar el horario:", error);
            setMensaje("Error al eliminar el horario.");
        }
        setBotonConfirmacion(null); // Resetea el estado de confirmación
    };

    return (
        <div className="ctn-horarios">
            <h3>Tus horarios de atención</h3>
            <div className="form-horario-atencion">
                <div className="heads">
                    {
                        ["Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado", "Domingo"].map((dia, index) => (
                            <button
                                key={index}
                                value={dia}
                                className={botonActivo === index ? "active" : ""} // Aplica la clase "active" si es el botón activo
                                onClick={() => {
                                    setHorarioData({ ...horarioData, dia_semana: dia });
                                    setBotonActivo(index);
                                }}
                            >
                                {dia}
                            </button>
                        ))
                    }
                </div>
                <div className="body">
                    <ul className={obtenerClaseHorarios() + " list-group list-group-flush"}>
                        {horariosFiltrados.length > 0 ? (
                            horariosFiltrados.map((horario, index) => (
                                <li key={index} className="list-group-item d-flex align-items-center justify-content-between">
                                    <p>De <strong>{horario.hora_inicio}</strong> a <strong>{horario.hora_fin}</strong> <span className="mx-2">|</span> <strong>{horario.Especialidad.nombre}</strong></p>
                                    {botonConfirmacion === horario.id ? (
                                        <div>
                                            <button className="btn btn-danger" onClick={() => handleConfirmDelete(horario.id)}>
                                                Confirmar
                                            </button>
                                            <button className="btn btn-light ms-2" onClick={() => setBotonConfirmacion(null)}>
                                                <i className="bi bi-x-lg"></i>
                                            </button>
                                        </div>
                                    ) : (
                                        <button className="btn btn-light" onClick={() => handleDeleteClick(horario.id)}>
                                            <i className="bi bi-trash3"></i>
                                        </button>
                                    )}
                                </li>
                            ))
                        ) : (
                            <p>No tienes horarios de atención registrados</p>
                        )}
                    </ul>
                    <hr />
                    <div className="form">
                        <div>
                            <label htmlFor="especialidad">Especialidad</label>
                            <select
                                value={horarioData.id_especialidad}
                                id="especialidad"
                                disabled={horarioData.dia_semana ? false : true}
                                onChange={(e) => {
                                    setHorarioData({ ...horarioData, id_especialidad: e.target.value });
                                    setMensaje("")
                                }}
                                className="form-select"
                            >
                                <option value="">Selecciona aquí</option>
                                {tiposServicio.map((tipoServ, index) => (
                                    <option key={index} value={tipoServ.id}>
                                        {tipoServ.nombre}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="hora_inicio">Hora desde</label>
                            <input disabled={horarioData.dia_semana && horarioData.id_especialidad ? false : true} className="form-control" id="hora_inicio" type="time" value={horarioData.hora_inicio} onChange={(e) => {
                                setHorarioData({ ...horarioData, hora_inicio: e.target.value })
                                setMensaje("")

                            }} />
                        </div>
                        <div>
                            <label htmlFor="hora_fin">Hora hasta</label>
                            <input disabled={horarioData.dia_semana && horarioData.hora_inicio ? false : true} className="form-control" id="hora_fin" type="time" value={horarioData.hora_fin} onChange={(e) => {
                                setHorarioData({ ...horarioData, hora_fin: e.target.value })
                                setMensaje("")
                            }} />
                        </div>
                        <button className="add-horario" onClick={handleAddHorario}>
                            <i className="bi bi-plus-circle"></i>
                        </button>
                    </div>
                    {mensaje}
                </div>
            </div>
        </div >
    );
}

