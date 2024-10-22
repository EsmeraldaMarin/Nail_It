
import "./MostrarServicios.scss"
import circulo from '../../img/circulo.png'
import axios from '../../axiosConfig/axiosConfig';
import React, { useState, useEffect } from 'react';

const MostrarServicios = () => {
    const [servicios, setServicios] = useState([]);

    useEffect(() => {
        const fetchServicios = async () => {
            try {
                const response = await axios.get('/servicio');
                setServicios(response.data);
            } catch (error) {
                console.error('Error al obtener los servicios', error);
            }
        };
        fetchServicios();
    }, []);


    const row =  servicios.map((servicio) => (
        <div className="col-sm-3" key={servicio.id}>
                        <div className="block-content">
                        <div className="block-img-round">
                            <img className="mb-0" alt="" src={circulo} />
                            <span className="overlay-img"></span>
                            <div className="block-text">
                            <h5 className="secondary-font text mb-0">{servicio.nombre}</h5>
                            </div>
                        </div>
                        </div>
            </div>

    ))

    return (
        <section id="servicios" className="services text-center main">
  {/* Container */}
            <div className="container">
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
            <div className="container">
                {/* Row */}
                <div className="row">
                    {row}
                </div>
               
                {/* End row */}

            </div>
  {/* End container */}
        </section>


    )
}

export default MostrarServicios