import React from 'react';
import "./Reserva.scss"

const HorarioSelect = ({ horario, setHorario }) => {
    //hacer conexion con el back 
    const horarios = ['9:00 AM', '10:00 AM', '11:00 AM', '1:00 PM', '2:00 PM'];

    return (
        <div className="mb-3 horarios-select">
            <label>Seleccione un horario</label>
            <div className='btn-carrusel'>
                <span className="line"></span>
                {horarios.map((h, index) => (
                    <button className={`btn`} key={index} value={h} onClick={(e) => setHorario(e.target.value)}>
                        {h}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default HorarioSelect;
