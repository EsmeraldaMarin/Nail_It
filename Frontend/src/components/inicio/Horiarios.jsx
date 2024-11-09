
import './Horarios.scss';
import imagenBlur from '../../img/local.jpeg'; // Reemplaza con la ruta de tu imagen
import React, { useState, useEffect } from 'react';
import axios from '../../axiosConfig/axiosConfig';

const Horarios = () => {

    const [vari, setVar] = useState([]);
    useEffect(() => {
        const fetchServicios = async () => {
            try {
                const response = await axios.get('/variablesGlobales');
                setVar(response.data);
            } catch (error) {
                console.error('Error al obtener las veriable globales', error);
            }
        };
        fetchServicios();
    }, []);

  return (
    
      <div className="horarios-container horarios-section">
        <img src={imagenBlur} alt="Horarios" className="blur-image" />
        <div className="horarios-text">
          <h2>Horarios de Atención</h2>
          <p>Lunes a Sábado: 8:00 AM - 6:00 PM</p>
          
          <p>Domingo: Cerrado</p>
        </div>
      </div>
    
  );
};

export default Horarios;