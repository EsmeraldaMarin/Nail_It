import React, { useState, useEffect } from 'react';
import "../Reserva.scss";

const FechaSelect = ({ servicio, fecha, setFecha, fechaInput, setFechaInput }) => {
    const [minDate, setMinDate] = useState('');
    const [maxDate, setMaxDate] = useState('');
    const [mostrarMsg, setMostrarMsg] = useState(false);

    useEffect(() => {
        // Obtener la fecha actual
        const today = new Date();
        const currentDate = today.toISOString().split('T')[0]; // Formato YYYY-MM-DD

        // Calcular la fecha de un mes adelante
        const nextMonth = new Date();
        nextMonth.setMonth(today.getMonth() + 1);

        // Verificar si al sumar un mes cambiamos de año
        if (nextMonth.getMonth() === 0) {
            nextMonth.setFullYear(today.getFullYear() + 1);
        }

        const maxDateValue = nextMonth.toISOString().split('T')[0];

        // Establecer los valores de min y max
        setMinDate(currentDate);
        setMaxDate(maxDateValue);
    }, []);

    // Validar la fecha ingresada por el usuario
    const handleFechaChange = (e) => {
        const inputFecha = e.target.value;
        setFechaInput(inputFecha); // Actualiza temporalmente el input de fecha

        // Solo validar cuando la fecha esté completamente ingresada (formato YYYY-MM-DD)
        if (inputFecha.length === 10) {
            if (inputFecha >= minDate && inputFecha <= maxDate) {
                setFecha(inputFecha);
                setMostrarMsg(false); // Oculta el mensaje de error
            } else {
                setMostrarMsg(true); // Muestra el mensaje de error si está fuera del rango
            }
        }
    };

    return (
        <div className="mb-3 col" style={{ minWidth: "200px" }}>
            <label>Fecha</label>
            <input
                disabled={!servicio} // Si no hay servicio seleccionado, deshabilitar el input
                type="date"
                value={fechaInput} // Muestra la fecha temporal
                onChange={(e) => {
                    handleFechaChange(e);
                }} // Cambia mientras el usuario escribe
                className="form-control"
                required
                min={minDate} // Fecha mínima: hoy
                max={maxDate} // Fecha máxima: hoy + 1 mes
            />
            {mostrarMsg && (
                <span className="text-danger position-absolute" style={{ fontSize: "14px" }}>
                    Selecciona una fecha entre {minDate} y {maxDate}
                </span>
            )}
        </div>
    );
};

export default FechaSelect;
