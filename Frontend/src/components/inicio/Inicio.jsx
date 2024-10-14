import React, { useState } from 'react';
import Title from './Title';
import Mis_turnos from './Mis_Trunos_btn';
import "./Inicio.scss"
import ReservaContext from '../reserva/reservaContext'
const Inicio = () => {
  return (
    <div className='container-fluid inicio'>
      <Mis_turnos></Mis_turnos>
      <Title></Title>
      <ReservaContext></ReservaContext>
    </div>
  );
};

export default Inicio;
