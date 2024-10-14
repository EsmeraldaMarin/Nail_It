import React, { useState } from 'react';
import Mis_turnos from './Mis_Trunos_btn';
import "./Inicio.scss"
import ReservaContext from '../reserva/reservaContext'
const Inicio = () => {
  return (
    <div className='container-fluid inicio'>
      <div className='title container-fluid'>
        <h1>Oh My Nails</h1>
        <div>
          <i className="bi bi-geo-alt"></i>
          <p>24 de Septiembre 1846 - B° Gral. Paz - Córdoba</p>
        </div>
      </div>
      <Mis_turnos></Mis_turnos>
      <ReservaContext></ReservaContext>
    </div>
  );
};

export default Inicio;
