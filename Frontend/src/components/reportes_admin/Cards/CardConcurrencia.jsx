import React, { useState, useEffect } from "react";
import axios from "../../../axiosConfig/axiosConfig";
import '../Reportes.scss';
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

// 🔹 ¡Registramos los módulos que usa Chart.js!
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const CardConcurrencia = () => {
    const rangosHorarios = ["8:00", "9:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"];
    const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

    const [datosConcurrencia, setDatosConcurrencia] = useState(Array(13).fill(0));
    const [datosConcurrenciaMensual, setDatosConcurrenciaMensual] = useState(Array(12).fill(0));
    const [añoSeleccionado, setAñoSeleccionado] = useState(new Date().getFullYear());
    const [añoSeleccionado2, setAñoSeleccionado2] = useState(new Date().getFullYear());
    const [mesSeleccionado, setMesSeleccionado] = useState("");

    useEffect(() => {
        getConcurrenciaReservas();
    }, [añoSeleccionado, mesSeleccionado]);
    useEffect(() => {
        getConcurrenciaMensualReservas();
    }, [añoSeleccionado2]);

    const getConcurrenciaReservas = async () => {
        try {
            const response = await axios.get('/reserva');
            const concurrencia = Array(13).fill(0);

            response.data.forEach(reserva => {
                const hora = parseInt(reserva.horaInicio.split(':')[0], 10);
                const fechaReserva = new Date(reserva.fecha.split(" ")[0]);
                const añoReserva = fechaReserva.getFullYear();
                const mesReserva = fechaReserva.getMonth();

                // Filtrar por año y mes seleccionado (si aplica)
                if (añoReserva === añoSeleccionado && (mesSeleccionado === "" || mesReserva === parseInt(mesSeleccionado))) {
                    concurrencia[hora - 8] = (concurrencia[hora - 8] || 0) + 1;
                }
            })

            setDatosConcurrencia(concurrencia);
        } catch (error) {
            console.error("Error obteniendo concurrencia por horario:", error);
        }
    };

    const getConcurrenciaMensualReservas = async () => {
        try {
            const response = await axios.get('/reserva');
            const concurrencia = Array(12).fill(0);

            response.data.forEach(reserva => {
                if (!reserva.fecha) return;

                const fechaReserva = new Date(reserva.fecha.split(" ")[0]);
                const añoReserva = fechaReserva.getFullYear();
                const mesReserva = fechaReserva.getMonth();

                // Filtrar solo por año seleccionado
                if (añoReserva === añoSeleccionado2) {
                    concurrencia[mesReserva] += 1;
                }
            });

            setDatosConcurrenciaMensual(concurrencia);
        } catch (error) {
            console.error("Error obteniendo concurrencia mensual:", error);
        }
    };

    const options = {
        responsive: true,
        scales: {
            x: { title: { display: true, text: "Horarios de Reserva" } },
            y: { beginAtZero: true, title: { display: true, text: "Cantidad de Reservas" } },
        },
    };

    const optionsMeses = {
        responsive: true,
        scales: {
            x: { title: { display: true, text: "Meses del Año" } },
            y: { beginAtZero: true, title: { display: true, text: "Cantidad de Reservas" } },
        },
    };

    return (
        <div className="card-concurrencia">
            <h5 className="mb-3">Concurrencia de reservas por horario</h5>

            <div className="filtros d-flex align-items-center justify-content-between mb-2">
                <label className="me-2">Mes:</label>
                <select className="form-select" value={mesSeleccionado} onChange={(e) => setMesSeleccionado(e.target.value)}>
                    <option value="">Todos</option>
                    {meses.map((mes, index) => (
                        <option key={index} value={index}>{mes}</option>
                    ))}
                </select>
                <label className="me-2 ms-3">Año:</label>
                <input className="form-control" type="number" value={añoSeleccionado} onChange={(e) => setAñoSeleccionado(parseInt(e.target.value, 10))} />

            </div>

            <Bar data={{ labels: rangosHorarios, datasets: [{ label: "Reservas por horario", data: datosConcurrencia, backgroundColor: "rgba(75,192,192,0.6)" }] }} options={options} />

            <h5 className="mt-2 mb-3">Concurrencia de reservas en el año</h5>
            <div className="filtros d-flex align-items-center mb-2 justify-content-end">
                <label className="me-2 ms-3">Año:</label>
                <input className="form-control"  style={{width:"35%"}} type="number" value={añoSeleccionado2} onChange={(e) => setAñoSeleccionado2(parseInt(e.target.value, 10))} />
            </div>

            <Bar data={{ labels: meses, datasets: [{ label: "Reservas por mes", data: datosConcurrenciaMensual, backgroundColor: "rgba(103, 27, 211, 0.6)" }] }} options={optionsMeses} />
        </div>
    );
};

export default CardConcurrencia;
