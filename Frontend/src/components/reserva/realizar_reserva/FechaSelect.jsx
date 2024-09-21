import React, { useState, useEffect } from 'react';
import "./Reserva.scss"

const FechaSelect = ({ fecha, setFecha }) => {
    //esto es para evitar que el usuario seleccione una fecha mas adelante que un mes desde hoy
    const [minDate, setMinDate] = useState('');
    const [maxDate, setMaxDate] = useState('');
    useEffect(() => {
        // Obtener la fecha actual
        const today = new Date();
        const currentDate = today.toISOString().split('T')[0]; // Formato YYYY-MM-DD

        // Calcular la fecha de un mes adelante
        const nextMonth = new Date();
        nextMonth.setMonth(today.getMonth() + 1); // Sumar un mes
        const maxDateValue = nextMonth.toISOString().split('T')[0];

        // Establecer los valores de min y max
        setMinDate(currentDate);
        setMaxDate(maxDateValue);
    }, []);

    return (
        <div className="mb-3 col">
            <label>Fecha</label>
            <input
                type="date"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                className="form-control"
                required
                min={minDate}
                max={maxDate}
            />
        </div>
    );
};

export default FechaSelect;
