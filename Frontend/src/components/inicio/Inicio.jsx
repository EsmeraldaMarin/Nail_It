import React, { useState } from 'react';
import imagenUñas1 from '../../img/uñas1.jpg'
import imagenUñas2 from '../../img/uñas2.jpg'
import imagenUñas3 from '../../img/uñas3.jpg'

import "./Inicio.scss"
import MostrarServicios from './MostarServicios';
import Horarios from './Horiarios';
import Ubicacion from './Ubicacion';
import { useNavigate } from "react-router-dom"


const Inicio = () => {
  const navigate = useNavigate();
  return (

    <div className='inicio'>
      <div className='layout_inicio'>
        <div className='titulo'>
          <h1>OH MY NAILS</h1>
        </div>
        <div className='separador_color'>
          <h1>OH MY NAILS</h1>
          <p>¡Bienvenida a nuestro sitio web de reservas!</p>
          <p>Nosotras te brindaremos diseños únicos para tus uñas.</p>
          <div className='reservar'>
            <button className='btn btn-reservar' onClick={() => { navigate('/inicio/realizar_reserva') }}>
              Realizar Reserva
            </button>
          </div>
        </div>
        <img className="img1" src={imagenUñas1} alt='imagen'></img>
        <div className='reservar'>
          <button className='btn btn-reservar' onClick={() => { navigate('/inicio/realizar_reserva') }}>
            Realizar Reserva
          </button>
        </div>
      </div>
      <MostrarServicios></MostrarServicios>
      <div className="main-container">
        <Horarios />
        <Ubicacion />
      </div>
    </div>

  );
};

export default Inicio;
