import React, { useEffect, useState } from 'react';
import "../Reserva.scss";

const HorarioSelect = ({ horarios, horariosOcupados, servicio_data, profesional, horario, setHorario }) => {

    let horarios_disponibles = [];
    const horariosDeMuestra = ["08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30"]

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

            const res = horariosOcupados.find(horarioOcupado =>
                (timeToMinutes(horarioOcupado.horaInicio) <= time && time < (timeToMinutes(horarioOcupado.horaInicio) + horarioOcupado.Servicio.duracion))
                ||
                (time + servicio_data.duracion > timeToMinutes(horarioOcupado.horaInicio) && time + servicio_data.duracion < (timeToMinutes(horarioOcupado.horaInicio) + horarioOcupado.Servicio.duracion)
            ))
    if (res) {
        console.log(time, res, timeToMinutes(res.horaInicio), timeToMinutes(res.horaInicio) + res.Servicio.duracion)
        horarios_disponibles.push({ hora: minutesToTime(time), estado: "ocupado" });
        time = (timeToMinutes(res.horaInicio) + res.Servicio.duracion) - duracion
    } else {
        horarios_disponibles.push({ hora: minutesToTime(time), estado: "desocupado" });

    }
}
        console.log({ ...horarios_disponibles })
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
