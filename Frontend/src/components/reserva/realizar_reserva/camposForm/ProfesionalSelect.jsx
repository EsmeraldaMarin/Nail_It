import React, { useEffect, useState } from 'react';
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

  const handleChange = (e) => {
    setProfesional(e.target.value)

    fecha = convertToISO(fecha);
    buscarReservasEnDiayProfesionalSeleccionado(fecha, e.target.value);
  }
  return (
    <div className="mb-3 col" style={{ minWidth: "200px" }}>
      <label>Operadora</label>

      {profesionales.length == 0 && fecha ?
        <div className='mt-2'>
          <span className='text-danger'>
            <i className="bi bi-exclamation-diamond me-2"></i>
            No hay operadoras para esa fecha</span>

        </div>
        :
        <select disabled={fecha ? false : true} value={profesional} onChange={(e) => handleChange(e)} className="form-select">
          <option value="">Seleccione una operadora</option>
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
