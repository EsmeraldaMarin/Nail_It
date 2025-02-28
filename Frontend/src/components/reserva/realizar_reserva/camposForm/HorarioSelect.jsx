import React, { useEffect, useState } from 'react';
import "../Reserva.scss";

const HorarioSelect = ({ fechaSeleccionada, horarios, horariosOcupados, servicio_data, profesional, horario, setHorario }) => {
    const [horariosDisponibles, setHorariosDisponibles] = useState([]);

    const horariosDeMuestra = ["08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30"];

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

    // Calcular horarios disponibles
    useEffect(() => {
        if (!profesional || !fechaSeleccionada || !horarios || !servicio_data) return;

        const nuevosHorarios = [];
        console.log(profesional, fechaSeleccionada, horariosOcupados)
        horarios
            ?.sort((a, b) => timeToMinutes(a.hora_inicio) - timeToMinutes(b.hora_inicio))
            .forEach(h => {
                const horaInicio = timeToMinutes(h.hora_inicio);
                const horaFin = timeToMinutes(h.hora_fin);
                const duracion = servicio_data.duracion;

                for (let time = horaInicio; time + duracion <= horaFin; time += duracion) {
                    // Verificar si el horario está ocupado
                    const ocupado = horariosOcupados.some(horarioOcupado =>
                        (timeToMinutes(horarioOcupado.horaInicio) <= time &&
                            time < (timeToMinutes(horarioOcupado.horaInicio) + horarioOcupado.Servicio.duracion)) ||
                        (time + servicio_data.duracion > timeToMinutes(horarioOcupado.horaInicio) &&
                            time + servicio_data.duracion < (timeToMinutes(horarioOcupado.horaInicio) + horarioOcupado.Servicio.duracion))
                    );

                    nuevosHorarios.push({ hora: minutesToTime(time), estado: ocupado ? "ocupado" : "desocupado" });
                }
            });
            console.log(nuevosHorarios)
        setHorariosDisponibles(nuevosHorarios);
    }, [fechaSeleccionada, profesional, horariosOcupados, servicio_data]);

    return (
        <div className="mb-3 horarios-select">
            <label>Seleccione el horario</label>
            <div className='btn-carrusel'>
                <span className="line"></span>
                {profesional
                    ? horariosDisponibles.map((h, index) => (
                        <button
                            disabled={h.estado === "ocupado"}
                            className={`btn ${horario === h.hora ? 'active' : ''}`}
                            key={index}
                            value={h.hora}
                            onClick={(e) => setHorario(e.target.value)}
                        >
                            {h.hora}
                        </button>
                    ))
                    : horariosDeMuestra.map((h, index) => (
                        <button
                            disabled={!profesional}
                            className="btn"
                            key={index}
                            value={h}
                            onClick={(e) => setHorario(e.target.value)}
                        >
                            {h}
                        </button>
                    ))
                }
            </div>
        </div>
    );
};

export default HorarioSelect;
