import React, { useEffect, useState } from 'react';
import "../Reserva.scss"

const ProfesionalSelect = ({ fecha, profesional, profesionales, setProfesional }) => {
  return (
    <div className="mb-3 col">
      <label>Profesional</label>

      {profesionales.length == 0 && fecha ?
        <div>
          <span>No hay profesionales para esa fecha</span>

        </div>
        :
        <select disabled={fecha ? false : true} value={profesional} onChange={(e) => setProfesional(e.target.value)} className="form-select">
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
