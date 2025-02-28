import React, { useEffect, useState } from 'react';
import "../Reserva.scss";
import axios from '../../../../axiosConfig/axiosConfig';

const ProfesionalSelect = ({ fecha, profesional, profesionales, setProfesional, setHorariosOcupados }) => {

  function convertToISO(dateString) {
    const date = new Date(`${dateString}T00:00:00Z`);
    return date.toISOString();
  }

  const buscarReservasEnDiayProfesionalSeleccionado = async (fecha, id_profesional) => {
    if (!fecha || !id_profesional) return;  // Evita llamadas innecesarias

    try {
      const response = await axios.get(`/reserva?fecha=${fecha}&id_profesional=${id_profesional}`);
      const horarios_ocupados = response.data.filter(res => res.estado !== "cancelada" && res.estado !== "por_reembolsar");
      setHorariosOcupados(horarios_ocupados);
    } catch (error) {
      console.error('Error al buscar las reservas', error);
    }
  };

  useEffect(() => {
    if (fecha && profesional) {
      const currentDate = convertToISO(fecha).split('T')[0];
      buscarReservasEnDiayProfesionalSeleccionado(currentDate, profesional);
    }
  }, [fecha, profesional]);  // Se ejecuta cuando cambia la fecha o el profesional

  return (
    <div className="mb-3 col" style={{ minWidth: "200px" }}>
      <label>Operadora</label>

      {profesionales.length === 0 && fecha ? (
        <div className='mt-2'>
          <span className='text-danger'>
            <i className="bi bi-exclamation-diamond me-2"></i>
            No hay operadoras para esa fecha
          </span>
        </div>
      ) : (
        <select
          disabled={!fecha}
          value={profesional}
          onChange={(e) => setProfesional(e.target.value)}
          className="form-select"
        >
          <option value="">Seleccione una operadora</option>
          {profesionales?.map((pro, index) => (
            <option key={index} value={pro.id}>
              {pro.nombre}
            </option>
          ))}
        </select>
      )}
    </div>
  );
};

export default ProfesionalSelect;
