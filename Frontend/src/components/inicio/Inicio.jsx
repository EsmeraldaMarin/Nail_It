import React, { useState } from 'react';

import "./Inicio.scss"
import Carrusel from './Carrusel';
import MostrarServicios from './MostarServicios';
import Horarios from './Horiarios';
import Ubicacion from './Ubicacion';
import { useNavigate } from "react-router-dom"


const Inicio = () => {
  const navigate = useNavigate();
  return (

    <div className='inicio'>
      <Carrusel></Carrusel>
      <div className='reservar'>
        <button className='btn btn-reservar' onClick={()=>{navigate('/inicio/realizar_reserva')}}>
          Realizar reserva
          <i className='bi bi-chevron-right'></i>
        </button>
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
