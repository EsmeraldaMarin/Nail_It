import React, { useEffect, useState } from 'react';
import "../Reserva.scss";
import axios from '../../../../axiosConfig/axiosConfig';

const HorarioSelect = ({ fechaSeleccionada, horarios, horariosOcupados, servicio_data, profesional, horario, setHorario }) => {

    const horarios_disponibles = []
    const horariosDeMuestra = ["08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30"]
    const [diasLibres, setDiasLibres] = useState([]);

    useEffect(() => {
        const fetchDiasLibres = async () => {
            try {
                //este if profesional se pone porque cuando es null, la consulta a la BD me devuelve todos los dias libres
                if (profesional) {
                    const response = await axios.get(`/diasLibres?id_admin=${profesional}`);
                    if (response.status === 200) {
                        setDiasLibres(response.data);
                    }
                }
            } catch (error) {
                console.error("Hubo un error al obtener los días libres.");
                setMensaje("Hubo un error al obtener los días libres.");
            }
        };

        fetchDiasLibres();
    }, [profesional]);

    // Función para convertir una cadena de tiempo "HH:MM" a minutos
    const timeToMinutes = (time) => {
        const [hours, minutes] = time.split(':').map(Number);
        return hours * 60 + minutes;
    };

    // Función para convertir minutos a una cadena de tiempo "HH:MM"
    const minutesToTime = (minutes) => {
        const hours = Math.floor(minutes / 60).toString().padStart(2, '0');
        const mins = (minutes % 60).toString().padStart(2, '0');
        return `${hours}:${mins}`;
    };

    const estaDeVacacionesEnLaFechaSeleccionada = () => {
        return diasLibres.some(
            vacaciones =>
                fechaSeleccionada >= vacaciones.fecha_desde
                && fechaSeleccionada <= vacaciones.fecha_hasta);

    }

    // Ordenar horarios por hora de inicio
    const horarios_ordenados_horainicio = horarios?.sort((a, b) => {
        if (a.hora_inicio < b.hora_inicio) return -1;
        if (a.hora_inicio > b.hora_inicio) return 1;
        return 0;
    });

    // Calcular horarios disponibles
    horarios_ordenados_horainicio?.forEach(h => {
        const hora_inicio = timeToMinutes(h.hora_inicio);
        const hora_fin = timeToMinutes(h.hora_fin);
        const duracion = servicio_data.duracion;

        // Generar horarios a partir de la hora de inicio, mientras estén dentro del rango
        for (let time = hora_inicio; time + duracion <= hora_fin; time += duracion) {

            let res;
            const estaDeVacaciones = estaDeVacacionesEnLaFechaSeleccionada()

            if (!estaDeVacaciones) {
                res = horariosOcupados.find(horarioOcupado =>
                    // si la hora de inicio del horario ocupado es menor al tiempo minimo del intervalo evaluado y el tiempo minimo del intervalo evaluado es menor a la hora de fin del horario ocupado
                    (timeToMinutes(horarioOcupado.horaInicio) <= time
                        && time < (timeToMinutes(horarioOcupado.horaInicio) + horarioOcupado.Servicio.duracion))

                    || // o el tiempo maximo del intervalo evaluado es mayor a la hora de inicio del horario ocupado y el tiempo maximo del intervalo evaluado es menor a la hora del fin del horario ocupado

                    (time + servicio_data.duracion > timeToMinutes(horarioOcupado.horaInicio)
                        && time + servicio_data.duracion < (timeToMinutes(horarioOcupado.horaInicio) + horarioOcupado.Servicio.duracion)))

            }

            if (res) {
                horarios_disponibles.push({ hora: minutesToTime(time), estado: "ocupado" });

                //aqui lo que se hace es establecer el proximo intervalo de tiempo luego de que termine el turno ocupado.
                //Esto se hace para evitar analizar intervalos que sabemos que estaran ocupados y ademas para
                //que si estan parcialmente ocupados, no quede todo el rango horario ocupado.
                time = (timeToMinutes(res.horaInicio) + res.Servicio.duracion) - duracion
                
            } else if (estaDeVacaciones) {
                horarios_disponibles.push({ hora: minutesToTime(time), estado: "ocupado" });
            }
            else {
                horarios_disponibles.push({ hora: minutesToTime(time), estado: "desocupado" });
            }
        }
    });

    return (
        <div className="mb-3 horarios-select">
            <label>Seleccione el horario</label>
            <div className='btn-carrusel'>
                <span className="line"></span>
                {profesional ? horarios_disponibles.map((h, index) => (
                    <button disabled={h.estado == "desocupado" ? false : true} className={`btn ${horario === h.hora ? 'active' : ''}`} key={index} value={h.hora} onClick={(e) => setHorario(e.target.value)}>
                        {h.hora}
                    </button>
                )) : horariosDeMuestra.map((h, index) => (
                    <button disabled={profesional ? false : true} className={`btn`} key={index} value={h} onClick={(e) => setHorario(e.target.value)}>
                        {h}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default HorarioSelect;
