import React, { useState, useEffect } from "react";
import "../Reportes.scss";
import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from "chart.js";
import axios from "../../../axiosConfig/axiosConfig";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const colors = ["#4ec2b1", "#a067d3", "#55b0d3", "#dc0ed1", "#faaceb", "#ce0d23", "#7e8e57", "#8f13e8", "#10cf27", "#8b64fd", "#83ca63", "#c9ac0f"];

export default function CardServicios() {
    const [reservas, setReservas] = useState([]);
    const [demandaServicios, setDemandaServicios] = useState({});
    const [mes, setMes] = useState(0);
    const [anio, setAnio] = useState(new Date().getFullYear());
    const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    const getColor = (indice) => colors[indice % colors.length];

    useEffect(() => {
        const getReservas = async () => {
            try {
                const response = await axios.get("/reserva");
                setReservas(response.data);
            } catch (error) {
                console.error("Error al obtener las reservas", error);
            }
        };

        getReservas();
    }, []);

    useEffect(() => {
        const demanda = {};
        console.log(mes, anio);

        reservas.forEach(reserva => {
            const fecha = new Date(reserva.fecha);
            if ((mes === 0 || fecha.getMonth() + 1 === mes) && fecha.getFullYear() === anio) {
                const servicio = reserva.Servicio.nombre + " - " + reserva.Servicio.Especialidad.nombre;
                demanda[servicio] = (demanda[servicio] || 0) + 1;
            }
        });
        const demandaOrdenada = Object.fromEntries(
            Object.entries(demanda).sort((a, b) => b[1] - a[1]) // Orden descendente
        );
        setDemandaServicios(demandaOrdenada); // Asegurar que se actualice siempre, aunque sea vacío
    }, [mes, anio, reservas]);

    const servicios = Object.entries(demandaServicios);

    // Si no hay datos, mostrar un gráfico vacío
    const chartData = servicios.length > 0 ? {
        labels: servicios.map(([nombre], index) => `${index + 1}- ${nombre.slice(0, 5)}`),
        datasets: [
            {
                label: "Cantidad de Reservas",
                data: servicios.map(([_, cantidad]) => cantidad),
                backgroundColor: servicios.map((_, index) => getColor(index)),
            },
        ],
    } : {
        labels: ["No hay datos"],
        datasets: [
            {
                label: "Cantidad de Reservas",
                data: [0],
                backgroundColor: ["#ccc"], // Color gris para indicar vacío
            },
        ],
    };
    const options = {
        responsive: true,
        plugins: {
            legend: { display: false },
            title: { display: true, text: "Demanda de Servicios" },
        },
        scales: {
            x: { title: { display: true, text: "Servicios" } },
            y: { beginAtZero: true, title: { display: true, text: "Cantidad de Reservas" } },
        },
    };

    return (
        <div className="card-servicios">
            <h5>Demanda de Servicios</h5>
            <p className="p-0 m-0 mb-3" style={{ fontSize: "13px" }}>
                <i className="bi bi-info-circle"></i> Solo figuran los servicios con reservas
            </p>
            <div className="filters d-flex align-items-center">
                <label className="me-2">Mes:</label>
                <select className="form-select" value={mes} onChange={(e) => setMes(Number(e.target.value))}>
                    <option value={0}>Todos</option>
                    {meses.map((m, index) => (
                        <option key={index + 1} value={index + 1}>{m}</option>
                    ))}
                </select>

                <label className="ms-3 me-2">Año:</label>
                <input className="form-control" type="number" value={anio} onChange={(e) => setAnio(Number(e.target.value))} />

            </div>
            <Bar data={chartData} options={options} />
            <div style={{ marginTop: "10px" }}>
                <h5>Referencia de Servicios:</h5>
                <ul style={{ listStyle: "none", padding: 0 }}>
                    <li className="d-flex justify-content-between" style={{ display: "flex", alignItems: "center", marginBottom: "5px" }}>
                        <div>Servicio</div>
                        <span>Reservas</span>
                    </li>
                    {servicios.map(([nombre, cantidad], index) => (
                        <li className="d-flex justify-content-between" key={index} style={{ display: "flex", alignItems: "center", marginBottom: "5px" }}>
                            <div><span
                                style={{
                                    width: "20px",
                                    height: "20px",
                                    backgroundColor: getColor(index),
                                    display: "inline-block",
                                    marginRight: "10px",
                                }}
                            ></span>
                                {`${index + 1}: ${nombre}`}</div>
                            <span>{`--- ${cantidad}`}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}