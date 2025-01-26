
import "./MostrarServicios.scss"
import circulo from '../../img/circulo.png'
import axios from '../../axiosConfig/axiosConfig';
import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";

const MostrarServicios = () => {
    const [servicios, setServicios] = useState([]);

    useEffect(() => {
        const fetchServicios = async () => {
            try {
                const response = await axios.get('/servicio');
                console.log(response.data)
                setServicios(response.data);
            } catch (error) {
                console.error('Error al obtener los servicios', error);
            }
        };
        fetchServicios();
    }, []);


    const row = servicios.map((servicio) => (
        <div className="card mb-3" style={{width: "18rem"}} key={servicio.id}>
            <div className="card-body" style={{backgroundColor:"#f85b00", color:"#fff"}}>
                <h5 className="card-title">{servicio.nombre}</h5>
            </div>
            <ul className="list-group list-group-flush">
                <li className="list-group-item">Especialidad: {servicio.Especialidad.nombre}</li>
                <li className="list-group-item">Duración: {servicio.duracion}</li>
            </ul>
            <div className="card-body">
                <Link to="/inicio/realizar_reserva" className="card-link" style={{color:"#000"}}>Reservar Turno</Link>
            </div>
        </div>
    ))

    return (
        <section id="servicios" className="services text-center main">
            {/* Container */}
            <div className="mt-3">
                {/* Row */}
                <div className="row">
                    <div className="col-sm-12 gap-one-bottom">
                        <h2 className="mb-0 text-brown">Servicios</h2>
                    </div>
                </div>
                {/* End row */}
            </div>
            {/* End container */}

            {/* Container */}
            <div className="">
                {/* Row */}
                <div className="row-servicios d-flex flex-wrap gap-2 justify-content-center px-5">
                    {row}
                </div>

                {/* End row */}

            </div>
            {/* End container */}
        </section>


    )
}

export default MostrarServicios