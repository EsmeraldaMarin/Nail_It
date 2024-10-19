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

  const [tiposServicio, setTiposServicio] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [profesionales, setProfesionales] = useState([]);

  useEffect(() => {
    const fetchTiposServicio = async () => {
      try {
        const response = await axios.get('/especialidad');
        setTiposServicio(response.data);
      } catch (error) {
        console.error('Error al obtener las tiposServicio', error);
      }
    };
    fetchTiposServicio();
  }, []);


  //Esto se hace asi porque cuando se cambia la especialidad, no impacta hasta que se vuelve a renderizar el componente
  useEffect(() => {
    const fetchServicios = async () => {
      try {
        const response = await axios.get(`/servicio/especialidad/${tipoServicio}`);
        setServicios(response.data);
      } catch (error) {
        console.error('Error al obtener las servicios', error);
      }
    };
    fetchServicios()
  }, [reservaData]);

  useEffect(() => {
    const fetchProfesionales = () => {
      const profesionalesUnicos = [...new Set(reservaData.horarios_disponibles?.map(horario => horario.id_profesional))];
      profesionalesUnicos.forEach(async (id_profesional) => {
        try {

          const response = await axios.get(`/admin/${id_profesional}`);
          setProfesionales(...profesionales, response.data);
          console.log([...profesionales, response.data])

        } catch (error) {
          console.error('Error al obtener las servicios', error);
        }
      })
    };
    fetchProfesionales();
  }, [reservaData]);

  // Manejo de cambios en selects, para hacer la busqueda secuencial

  const handleTipoServicioChange = (nuevoTipoServicio) => {
    setReservaData({
      ...reservaData,
      tipoServicio: nuevoTipoServicio,
      servicio: null, // Resetea el servicio cuando cambia el tipo de servicio
      horario: '', // Resetea el horario cuando cambia el servicio
      profesional_data: null,
      fecha: '',
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

  // Función que maneja el cambio de tipo de servicio
  const handleFechaChange = async (nuevaFecha) => {

    const diasSemana = ["Domingo", "Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sábado"];
    const fechaSeleccionada = new Date(fecha);
    const indiceDia = fechaSeleccionada.getDay();
    console.log(diasSemana[indiceDia])

    const horarios_filtrados = await axios.get(`/horario?dia=${diasSemana[indiceDia]}&especialidad=${reservaData.tipoServicio}`);
    console.log(`/horario?dia=${diasSemana[indiceDia]}&especialidad=${reservaData.tipoServicio}`, horarios_filtrados, reservaData)
    setReservaData({
      ...reservaData,
      fecha: nuevaFecha,
      profesional_data: null, //Resetea el profesional cuando cambia la 
      horarios_disponibles: horarios_filtrados.data
    });
  };

  // Función que maneja el cambio de tipo de servicio
  const handleProfesionalChange = async (nuevoProfesional) => {
    const profesional_data = await axios.get(`/admin/${nuevoProfesional}`)

    setReservaData({
      ...reservaData,
      profesional: nuevoProfesional,
      profesional_data: profesional_data.data,
    });
  };

  const handleConfirm = () => {

    // Lógica de confirmación de reserva aquí (opcional)
    // Luego de confirmar, redirige a otra vista
    setPasoActual(2);
  };

  return (
    <div className="container-fluid">
      <TipoServicioSelect tiposServicio={tiposServicio} tipoServicio={tipoServicio} setTipoServicio={handleTipoServicioChange} />

      <div className="servicio-ctn">
        <ServicioSelect tipoServicio={tipoServicio} servicio={servicio} setServicio={handleServicioChange} servicios={servicios} />
        <InfoServicio servicio={servicio} reservaData={reservaData} />
      </div>

      <div className="row pt-4">
        <FechaSelect servicio={servicio} fecha={fecha} setFecha={handleFechaChange} />
        <ProfesionalSelect fecha={fecha} profesional={profesional} profesionales={profesionales} setProfesional={handleProfesionalChange} />
      </div>

      <HorarioSelect profesional={profesional} horario={horario} setHorario={(nuevoHorario) => setReservaData({ ...reservaData, horario: nuevoHorario })} />

      <button onClick={handleConfirm} className="btn btn-primary mt-3 btn-continuar" disabled={horario ? false : true}>
        Continuar
      </button>

    </div>
  );
};

export default ReservaCard;
