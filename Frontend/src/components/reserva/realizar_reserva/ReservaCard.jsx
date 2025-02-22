import React, { useState, useEffect } from 'react';
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
  //esto es para fecha select
  const [fechaInput, setFechaInput] = useState(fecha); // Para mantener la fecha temporalmente
  const [horariosOcupados, setHorariosOcupados] = useState([]);

  useEffect(() => {
    const fetchTiposServicio = async () => {
      try {
        const response = await axios.get('/especialidad');
        setTiposServicio(response.data);
      } catch (error) {
        console.error('Error al obtener las tiposServicio', error);
      }
    };
    const fetchMontoSenia = async () => {
      try {
        const response = await axios.get('/variablesGlobales');
        setReservaData({
          ...reservaData,
          montoSenia: response.data[0].importe_seña
        });

      } catch (error) {
        console.error('Error al obtener el importe de senia', error);
      }
    }
    fetchTiposServicio();
    fetchMontoSenia();
  }, []);

  //Esto se hace asi porque cuando se cambia la especialidad, no impacta hasta que se vuelve a renderizar el componente
  useEffect(() => {

    const fetchServicios = async () => {
      if (tipoServicio != "") {
        try {
          const response = await axios.get(`/servicio/especialidad/${tipoServicio}`);
          const serviciosActivos = response.data.filter(servicio => servicio.esta_activo)
          setServicios(serviciosActivos);
        } catch (error) {
          console.error('Error al obtener las servicios', error);
        }
      }
    };
    fetchServicios()
  }, [reservaData]);

  useEffect(() => {
    const fetchProfesionales = async () => {
      try {
        // Resetea el estado
        setProfesionales([]);

        // Obtener IDs únicos de los profesionales
        const profesionalesUnicos = [...new Set(reservaData.horarios_disponibles?.map(horario => horario.id_profesional))];

        // Crear un array de promesas con las llamadas a la API
        const promesas = profesionalesUnicos.map(id_profesional => axios.get(`/admin/${id_profesional}`));

        // Esperar a que todas las promesas se resuelvan
        const resultados = await Promise.all(promesas);

        // Extraer los datos de la respuesta
        const profesionales = resultados.map(response => response.data);

        // Actualizar el estado con los profesionales
        setProfesionales(profesionales);
      } catch (error) {
        console.error('Error al obtener los profesionales', error);
      }
    };

    if (reservaData.horarios_disponibles) {
      fetchProfesionales();
    }
  }, [reservaData.horarios_disponibles]);


  // Manejo de cambios en selects, para hacer la busqueda secuencial

  const handleTipoServicioChange = (nuevoTipoServicio) => {
    setReservaData({
      ...reservaData,
      tipoServicio: nuevoTipoServicio,
      servicio: null, // Resetea el servicio cuando cambia el tipo de servicio
      horario: '', // Resetea el horario cuando cambia el servicio
      profesional_data: null,
      profesional: '',
      fecha: '',
    });
    setFechaInput("")
  };

  const handleServicioChange = async (nuevoServicio) => {
    const servicio_data = await axios.get(`/servicio/${nuevoServicio}`)
    setReservaData({
      ...reservaData,
      servicio: nuevoServicio,
      servicio_data: servicio_data.data,
      precio: servicio_data.data.precio,
      duracion: servicio_data.data.duracion,
      fecha: '',
      horario: '', // Resetea el horario cuando cambia el servicio
      profesional: '',
      profesional_data: null, //Resetea el profesional cuando cambia la 

    });
    setFechaInput("")
  };

  // Función que maneja el cambio de tipo de servicio
  const handleFechaChange = async (nuevaFecha) => {

    //NO AGREGAR TILDES, SE ROMPE TODO
    const diasSemana = ["Domingo", "Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado"];
    const fechaSeleccionada = new Date(new Date(nuevaFecha).getTime() + new Date().getTimezoneOffset() * 60000);
    const indiceDia = fechaSeleccionada.getDay();

    const horarios_filtrados = await axios.get(`/horario?dia=${diasSemana[indiceDia]}&especialidad=${reservaData.tipoServicio}`);
    setReservaData({
      ...reservaData,
      fecha: nuevaFecha,
      profesional_data: null, //Resetea el profesional cuando cambia la 
      horarios_disponibles: horarios_filtrados.data,
      horario: "",
      profesional: ''
    });
  };

  // Función que maneja el cambio de tipo de servicio
  const handleProfesionalChange = async (nuevoProfesional) => {
    const profesional_data = await axios.get(`/admin/${nuevoProfesional}`)
    const horariosXprofesional = reservaData.horarios_disponibles.filter(h => h.id_profesional == nuevoProfesional);
    setReservaData({
      ...reservaData,
      profesional: nuevoProfesional,
      profesional_data: profesional_data.data,
      horariosXprofesional: horariosXprofesional
    });
  };

  const handleConfirm = () => {

    // Lógica de confirmación de reserva aquí (opcional)
    // Luego de confirmar, redirige a otra vista
    setPasoActual(2);
    window.scrollTo(0, 0);

  };

  return (
    <div className="reserva-card">
      <h2 className='text-center pb-2 mb-3 border-bottom'>Realizá tu reserva</h2>
      <TipoServicioSelect tiposServicio={tiposServicio} tipoServicio={tipoServicio} setTipoServicio={handleTipoServicioChange} />

      <div className="servicio-ctn">
        <ServicioSelect tipoServicio={tipoServicio} servicio={servicio} setServicio={handleServicioChange} servicios={servicios} />
        <InfoServicio servicio={servicio} reservaData={reservaData} />
      </div>

      <div className="row pt-4">
        <FechaSelect servicio={servicio} fecha={fecha} setFecha={handleFechaChange} fechaInput={fechaInput} setFechaInput={setFechaInput} />
        <ProfesionalSelect fecha={fecha} profesional={profesional} profesionales={profesionales} setProfesional={handleProfesionalChange} setHorariosOcupados={setHorariosOcupados} />
      </div>

      <HorarioSelect fechaSeleccionada={fecha} horarios={reservaData.horariosXprofesional} horariosOcupados={horariosOcupados} servicio_data={reservaData.servicio_data} profesional={profesional} horario={horario} setHorario={(nuevoHorario) => setReservaData({ ...reservaData, horario: nuevoHorario })} />

      <button onClick={handleConfirm} className="btn mt-3 btn-continuar" disabled={horario ? false : true}>
        Continuar
      </button>

    </div>
  );
};

export default ReservaCard;
