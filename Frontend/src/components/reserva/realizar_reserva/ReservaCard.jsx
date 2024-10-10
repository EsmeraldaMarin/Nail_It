import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProfesionalSelect from './camposForm/ProfesionalSelect';
import FechaSelect from './camposForm/FechaSelect';
import ServicioSelect from './camposForm/ServicioSelect';
import TipoServicioSelect from './camposForm/TipoServicioSelect';
import HorarioSelect from './camposForm/HorarioSelect';
import InfoServicio from './camposForm/InfoServicio';
import "./Reserva.scss"
import axios from '../../../axiosConfig/axiosConfig';

const ReservaCard = ({ setPasoActual, reservaData, setReservaData }) => {
  const { profesional, fecha, servicio, tipoServicio, horario } = reservaData;

  const [servicios, setServicios] = useState([]);
  const [profesionales, setProfesionales] = useState([]);

  
  useEffect(() => {
    const fetchProfesionales = async () => {
      try {
        const response = await axios.get(`/admin`);
        setProfesionales(response.data);
      } catch (error) {
        console.error('Error al obtener las profesionales', error);
      }
    };
    fetchProfesionales();
}, []);

  
  const fetchServicios = async () => {
    try {
      const response = await axios.get(`/servicio/especialidad/${tipoServicio}`);
      setServicios(response.data);
    } catch (error) {
      console.error('Error al obtener las servicios', error);
    }
  };
  // Función que maneja el cambio de tipo de servicio
  const handleProfesionalChange = async(nuevoProfesional) => {
    const profesional_data = await axios.get(`/admin/${nuevoProfesional}`)

    setReservaData({
      ...reservaData,
      profesional: nuevoProfesional,// Resetea el horario cuando cambia el servicio
      profesional_data : profesional_data.data,
    });
  };
  const handleTipoServicioChange = (nuevoTipoServicio) => {
    setReservaData({
      ...reservaData,
      tipoServicio: nuevoTipoServicio,
      servicio: null, // Resetea el servicio cuando cambia el tipo de servicio
      horario: '', // Resetea el horario cuando cambia el servicio
    });
  };

  const handleServicioChange = async (nuevoServicio) => {
    const servicio_data = await axios.get(`/servicio/${nuevoServicio}`)
    setReservaData({
      ...reservaData,
      servicio: nuevoServicio,
      servicio_data: servicio_data.data,
      precio: servicio_data.data.precio,
      duracion: servicio_data.data.duracion,
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
        <ProfesionalSelect profesional={profesional} profesionales={profesionales} setProfesional={handleProfesionalChange} />
        <FechaSelect fecha={fecha} setFecha={(nuevaFecha) => setReservaData({ ...reservaData, fecha: nuevaFecha })} />
      </div>

      {/* ver como relacionar el tipo de servicio con el servicio */}
      <TipoServicioSelect tipoServicio={tipoServicio} setTipoServicio={handleTipoServicioChange} fetchServicios={fetchServicios} />

      {/* Verifica que el usuario haya seleccionado un tipo de servicio */}

      <div className="servicio-ctn">
        <ServicioSelect tipoServicio={tipoServicio} servicio={servicio} setServicio={handleServicioChange} servicios={servicios} />
        <InfoServicio servicio={servicio} reservaData={reservaData} />
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
