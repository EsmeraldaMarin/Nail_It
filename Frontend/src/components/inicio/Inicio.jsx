import React, { useState } from 'react';

import "./Inicio.scss"
import Carrusel from './Carrusel';
import MostrarServicios from './MostarServicios';
import Horarios from './Horiarios';
import Ubicacion from './Ubicacion';


const Inicio = () => {
  return (

  <div className='inicio'>
    <Carrusel></Carrusel>
    <MostrarServicios></MostrarServicios>
    <div className="main-container">
            <Horarios />
            <Ubicacion />
        </div>
  </div>

  );
};

export default Inicio;
