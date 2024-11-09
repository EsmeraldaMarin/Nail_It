import React, { useEffect, useState } from 'react';
<<<<<<< HEAD
import "../Reserva.scss";
import axios from '../../../../axiosConfig/axiosConfig';

const ProfesionalSelect = ({ fecha, profesional, profesionales, setProfesional, setHorariosOcupados }) => {


  function convertToISO(dateString) {
    // Crear un objeto Date con la fecha en formato yyyy-MM-dd
    const date = new Date(`${dateString}T00:00:00Z`);

    // Convertir la fecha al formato ISO 8601
    return date.toISOString();
  }

  const buscarReservasEnDiayProfesionalSeleccionado = async (fecha, id_profesional) => {
    try {
      const response = await axios.get(`/reserva?fecha=${fecha}&id_profesional=${id_profesional}`);
      const horarios_ocupados = response.data.filter(res => res.estado != "cancelada")
      setHorariosOcupados(horarios_ocupados)
    } catch (error) {
      console.error('Error al buscar las reservas', error);
    }
  };

  const handleHange = (e) => {
    setProfesional(e.target.value)

    fecha = convertToISO(fecha);
    buscarReservasEnDiayProfesionalSeleccionado(fecha, e.target.value);
  }
=======
import "../Reserva.scss"

const ProfesionalSelect = ({ fecha, profesional, profesionales, setProfesional }) => {
>>>>>>> ecba6c62ded3697c51d1ad22b4f35c711d1fe836
  return (
    <div className="mb-3 col">
      <label>Profesional</label>

      {profesionales.length == 0 && fecha ?
        <div>
          <span>No hay profesionales para esa fecha</span>

        </div>
        :
<<<<<<< HEAD
        <select disabled={fecha ? false : true} value={profesional} onChange={(e) => handleHange(e)} className="form-select">
=======
        <select disabled={fecha ? false : true} value={profesional} onChange={(e) => setProfesional(e.target.value)} className="form-select">
>>>>>>> ecba6c62ded3697c51d1ad22b4f35c711d1fe836
          <option value="">Seleccione un profesional</option>
          {profesionales?.map((pro, index) => (
            <option key={index} value={pro.id}>
              {pro.nombre}
            </option>
          ))
          }
        </select>
      }
    </div>
  );
};

export default ProfesionalSelect;
