import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProfesionalSelect from './ProfesionalSelect';
import FechaSelect from './FechaSelect';
import ServicioSelect from './ServicioSelect';
import TipoServicioSelect from './TipoServicioSelect';
import HorarioSelect from './HorarioSelect';
import InfoServicio from './InfoServicio';
import "./Reserva.scss"


const ReservaCard = ({ pasos, setPasoActual }) => {
  const [profesional, setProfesional] = useState('');
  const [fecha, setFecha] = useState('');
  const [servicio, setServicio] = useState(null);
  const [tipoServicio, setTipoServicio] = useState(null);
  const [horario, setHorario] = useState('');

  // Función que maneja el cambio de tipo de servicio
  const handleTipoServicioChange = (nuevoTipoServicio) => {
    // Cambia el tipo de servicio
    setTipoServicio(nuevoTipoServicio);

    // Resetea el servicio seleccionado cuando cambia el tipo de servicio
    setServicio('');
  };


  const handleConfirm = () => {
    
    // Lógica de confirmación de reserva aquí (opcional)
    // Luego de confirmar, redirige a otra vista
    setPasoActual(pasos[1])
  };

  return (
    <div className="container-fluid">

      <div className='row'>
        <ProfesionalSelect profesional={profesional} setProfesional={setProfesional} />
        <FechaSelect fecha={fecha} setFecha={setFecha} />
      </div>

      {/* ver como relacionar el tipo de servicio con el servicio */}
      <TipoServicioSelect tipoServicio={tipoServicio} setTipoServicio={handleTipoServicioChange} />

      {/*Verifica que el usuario haya seleccionado un tipo de servicio */}
      {tipoServicio && (
        <div className='servicio-ctn'>
          <ServicioSelect tipoServicio={tipoServicio} servicio={servicio} setServicio={setServicio} />
          <InfoServicio></InfoServicio>
        </div>
      )}

      {/* Verifica que el usuario haya seleccionado un servicio */}
      {servicio && <HorarioSelect horario={horario} setHorario={setHorario} />}

      {horario && (
        <button onClick={handleConfirm} className="btn btn-primary mt-3 btn-continuar">
          Continuar
        </button>
      )}

    </div>
  );
};

export default ReservaCard;
