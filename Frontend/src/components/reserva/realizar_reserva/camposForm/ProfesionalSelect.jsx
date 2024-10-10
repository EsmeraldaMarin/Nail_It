import React, { useEffect, useState } from 'react';
import "../Reserva.scss"

const ProfesionalSelect = ({ profesional, profesionales, setProfesional }) => {


  return (
    <div className="mb-3 col">
      <label>Profesional</label>
      <select
        value={profesional}
        onChange={(e) => setProfesional(e.target.value)}
        className="form-select"
      >
        <option value="">Cualquiera</option>
        {profesionales.map((pro) => (
          <option key={pro.id} value={pro.id}>
            {pro.nombre}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ProfesionalSelect;
