import React, { useState } from 'react';
import Title from './Title';
import ReservaCard from '../reserva/realizar_reserva/ReservaCard';
import CardInfoReserva from '../reserva/confirmar_reserva/CardInfoReserva';
import CardInfoTransferencia from '../reserva/adjuntar_comprobante/CardInfoTransferencia';
import "./Inicio.scss"
import CardOpExitosa from '../reserva/mensaje_exitoso/CardOpExitosa';
const Inicio = () => {
  const pasos = ["realizar_reserva, confirmar_reserva", "adjuntar_comprobante", "mensaje_exitoso"]
  const [pasoActual, setPasoActual] = useState(pasos[0]);
  return (
    <div className='container-fluid inicio'>
      <Title></Title>
      {pasoActual == pasos[0] && <ReservaCard pasos= {pasos} setPasoActual={setPasoActual}></ReservaCard>}
      {pasoActual == pasos[1] && <CardInfoReserva pasos= {pasos} setPasoActual={setPasoActual}></CardInfoReserva>}
      {pasoActual == pasos[2] && <CardInfoTransferencia pasos= {pasos} setPasoActual={setPasoActual}></CardInfoTransferencia>}
      {pasoActual == pasos[3] && <CardOpExitosa pasos= {pasos} setPasoActual={setPasoActual}></CardOpExitosa>}
      
    </div>
  );
};

export default Inicio;
