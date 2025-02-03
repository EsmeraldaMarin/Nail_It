import "./MostrarServicios.scss";
import axios from "../../axiosConfig/axiosConfig";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const MostrarServicios = () => {
    const [servicios, setServicios] = useState([]);

    useEffect(() => {
        const fetchServicios = async () => {
            try {
                const response = await axios.get("/servicio");
                setServicios(response.data);
            } catch (error) {
                console.error("Error al obtener los servicios", error);
            }
        };
        fetchServicios();
    }, []);

    return (
        <section id="servicios" className="services">
            <div className="title-container">
                <h2 className="title">Nuestros Servicios</h2>
            </div>
            <div className="services-container">
                {servicios.map((servicio) => (
                    <div 
                        key={servicio.id} 
                        className="service-card"
                    >
                        <div className="service-header">
                            <h3>{servicio.nombre}</h3>
                        </div>
                        <div className="service-details">
                            <p><strong>Especialidad:</strong> {servicio.Especialidad.nombre}</p>
                            <p><strong>Duración:</strong> {servicio.duracion} minutos</p>
                        </div>
                        <div className="service-footer">
                            <Link to="/inicio/realizar_reserva" className="reserve-button">
                                Realizar Reserva
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default MostrarServicios;
