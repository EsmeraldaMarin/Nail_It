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
    const [mes, setMes] = useState("");
    const [anio, setAnio] = useState(new Date().getFullYear());
    const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

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
        reservas.forEach(reserva => {
            const fecha = new Date(reserva.fecha);
            if ((mes === "" || fecha.getMonth() + 1 === mes) && fecha.getFullYear() === anio) {
                const servicio = reserva.Servicio.nombre;
                demanda[servicio] = (demanda[servicio] || 0) + 1;
            }
        });
        setDemandaServicios(demanda);
    }, [mes, anio, reservas]);


    const getColor = (indice) => colors[indice % colors.length];

    const servicios = Object.entries(demandaServicios);
    const chartData = {
        labels: servicios.map(([nombre], index) => `${index + 1}- ${nombre.slice(0, 5)}`),
        datasets: [
            {
                label: "Cantidad de Reservas",
                data: servicios.map(([_, cantidad]) => cantidad),
                backgroundColor: servicios.map((_, index) => getColor(index)),
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
            <h4>Demanda de Servicios</h4>
            <p className="p-0 m-0 mb-3">
                <i className="bi bi-info-circle"></i> Si no figuran servicios es porque no tienen reservas
            </p>
            <div className="filters d-flex align-items-center">
                <label className="me-2">Mes:</label>
                <select className="form-select" value={mes} onChange={(e) => setMes(Number(e.target.value))}>
                    <option value="">Todos</option>
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
                    {servicios.map(([nombre], index) => (
                        <li key={index} style={{ display: "flex", alignItems: "center", marginBottom: "5px" }}>
                            <span
                                style={{
                                    width: "20px",
                                    height: "20px",
                                    backgroundColor: getColor(index),
                                    display: "inline-block",
                                    marginRight: "10px",
                                }}
                            ></span>
                            {`${index + 1}: ${nombre}`}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}