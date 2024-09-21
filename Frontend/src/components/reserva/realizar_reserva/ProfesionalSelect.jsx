import React, { useEffect, useState } from 'react';
import "./Reserva.scss"

const ProfesionalSelect = ({ profesional, setProfesional }) => {
  const [profesionales, setProfesionales] = useState([]);

  // Simulación de llamada al backend para obtener profesionales
  useEffect(() => {
    const fetchProfesionales = () => {
      const data = [
        { id: 1, nombre: 'Profesional 1' },
        { id: 2, nombre: 'Profesional 2' },
      ];
      setProfesionales(data);
    };
    fetchProfesionales();
  }, []);

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
