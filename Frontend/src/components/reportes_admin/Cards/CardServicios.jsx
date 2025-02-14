import React from "react";
import "../Reportes.scss";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

// Registrar módulos de Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function CardServicios({ data }) {
    if (!data || Object.keys(data).length === 0) {
        return <p>No hay datos disponibles.</p>;
    }
    let colors = ["#4ec2b1", "#a067d3", "#55b0d3",  "#dc0ed1", "#faaceb", "#ce0d23", "#7e8e57", "#8f13e8", "#10cf27", "#8b64fd", "#83ca63", "#c9ac0f"]

    // Función para generar colores aleatorios en formato HEX
    const getColor = (indice) => {
        if (indice > colors.length - 1) {
            return colors[indice - colors.length]
        }
        return colors[indice]
    };

    // Obtener los nombres de los servicios y las cantidades de reservas
    const servicios = Object.entries(data); // [[nombreServicio1, cantidad], [nombreServicio2, cantidad], ...]

    // Generar colores aleatorios
    const colores = servicios.map((serv, index) => getColor(index));

    // Crear datos del gráfico
    const chartData = {
        labels: servicios.map(([nombre], index) => (index + 1) + "- " + nombre.slice(0, 5)),
        datasets: [
            {
                label: "Cantidad de Reservas",
                data: servicios.map(([_, cantidad]) => cantidad),
                backgroundColor: colores,
            },
        ],
    };

    // Configurar el gráfico
    const options = {
        responsive: true,
        plugins: {
            legend: { display: false }, // Oculta la leyenda predeterminada
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
                                    backgroundColor: colores[index],
                                    display: "inline-block",
                                    marginRight: "10px",
                                }}
                            ></span>
                            {(index + 1) + ': ' + nombre}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
