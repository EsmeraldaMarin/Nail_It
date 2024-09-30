import React, { useState } from 'react';
import Title from './Title';
import "./Inicio.scss"
import ReservaContext from '../reserva/reservaContext'
const Inicio = () => {
  return (
    <div className='container-fluid inicio'>
      <Title></Title>
      <ReservaContext></ReservaContext>
    </div>
  );
};

export default Inicio;
