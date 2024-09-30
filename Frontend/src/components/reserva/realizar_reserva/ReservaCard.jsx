import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProfesionalSelect from './ProfesionalSelect';
import FechaSelect from './FechaSelect';
import ServicioSelect from './ServicioSelect';
import TipoServicioSelect from './TipoServicioSelect';
import HorarioSelect from './HorarioSelect';
import InfoServicio from './InfoServicio';
import "./Reserva.scss"


const ReservaCard = ({ setPasoActual, reservaData, setReservaData }) => {
  const { profesional, fecha, servicio, tipoServicio, horario } = reservaData;

  // Función que maneja el cambio de tipo de servicio
  const handleTipoServicioChange = (nuevoTipoServicio) => {
    setReservaData({
      ...reservaData,
      tipoServicio: nuevoTipoServicio,
      servicio: null, // Resetea el servicio cuando cambia el tipo de servicio
      horario: '', // Resetea el horario cuando cambia el servicio
    });
  };

  const handleServicioChange = (nuevoServicio) => {
    setReservaData({
      ...reservaData,
      servicio: nuevoServicio,
      horario: '', // Resetea el horario cuando cambia el servicio
    });
  };

  const handleConfirm = () => {

    // Lógica de confirmación de reserva aquí (opcional)
    // Luego de confirmar, redirige a otra vista
    setPasoActual(2);
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <ProfesionalSelect profesional={profesional} setProfesional={(nuevoProfesional) => setReservaData({ ...reservaData, profesional: nuevoProfesional })} />
        <FechaSelect fecha={fecha} setFecha={(nuevaFecha) => setReservaData({ ...reservaData, fecha: nuevaFecha })} />
      </div>

      {/* ver como relacionar el tipo de servicio con el servicio */}
      <TipoServicioSelect tipoServicio={tipoServicio} setTipoServicio={handleTipoServicioChange} />

      {/* Verifica que el usuario haya seleccionado un tipo de servicio */}

      <div className="servicio-ctn">
        <ServicioSelect tipoServicio={tipoServicio} servicio={servicio} setServicio={handleServicioChange} />
        <InfoServicio servicio={servicio} />
      </div>
      

      {/* Verifica que el usuario haya seleccionado un servicio */}
      <HorarioSelect servicio={servicio} horario={horario} setHorario={(nuevoHorario) => setReservaData({ ...reservaData, horario: nuevoHorario })} />

      {horario && (
        <button onClick={handleConfirm} className="btn btn-primary mt-3 btn-continuar">
          Continuar
        </button>
      )}
    </div>
  );
};

export default ReservaCard;
