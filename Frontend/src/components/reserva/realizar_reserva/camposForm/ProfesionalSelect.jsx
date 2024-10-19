import React, { useEffect, useState } from 'react';
import "../Reserva.scss"

const ProfesionalSelect = ({ fecha, profesional, profesionales, setProfesional }) => {
  //console.log(profesionales)
  return (
    <div className="mb-3 col">
      <label>Profesional</label>
      {/* <select
        disabled={fecha ? false : true}
        value={profesional}
        onChange={(e) => setProfesional(e.target.value)}
        className="form-select"
      >
        {profesionales?.map((pro) => (
          <option key={pro.id} value={pro.id}>
            {pro.nombre}
          </option>
        ))}
      </select> */}
    </div>
  );
};

export default ProfesionalSelect;
