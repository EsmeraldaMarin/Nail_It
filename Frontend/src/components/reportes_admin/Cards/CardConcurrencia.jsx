import React, { useState, useEffect } from "react";
import '../Reportes.scss'
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

// 🔹 ¡Registramos los módulos que usa Chart.js!
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);


const CardConcurrencia = ({ data, dataMeses }) => {
    const rangosHorarios = ["8:00", "9:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"]
    const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

    const chartData = {
        labels: rangosHorarios,
        datasets: [{
            label: "Reservas por horario",
            data: Object.values(data),
            backgroundColor: "rgba(75,192,192,0.6)"
        }]
    };
    const chartDataMeses = {
        labels: meses,
        datasets: [{
            label: "Reservas por mes",
            data: Object.values(dataMeses),
            backgroundColor: "rgba(103, 27, 211, 0.6)"
        }]
    };
    const options = {
        responsive: true,
        scales: {
            x: { title: { display: true, text: "Horarios" } },
            y: { beginAtZero: true, title: { display: true, text: "Cantidad de Reservas" } },
        },
    };
    const optionsMeses = {
        responsive: true,
        scales: {
            x: { title: { display: true, text: "Meses" } },
            y: { beginAtZero: true, title: { display: true, text: "Cantidad de Reservas" } },
        },
    };

    return (
        <div className="card-concurrencia">
            <h4>Concurrencia de Horarios</h4>
            <Bar data={chartData} options={options} />
            <h4>Concurrencia de Meses</h4>
            <Bar data={chartDataMeses} options={optionsMeses} />
            
        </div>
    )
};

export default CardConcurrencia;