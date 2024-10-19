import React from 'react';
import "../Reserva.scss"

const HorarioSelect = ({ profesional, horario, setHorario }) => {
    //hacer conexion con el back 
    const horariosDeMuestra = ['9:00 AM', '10:00 AM', '11:00 AM', '1:00 PM', '2:00 PM'];
    //ESTO SE CONSIGUE CON UN FETCH
    const horarios = ['9:01 AM', '10:01 AM', '11:01 AM', '1:01 PM', '2:01 PM'];

    return (
        <div className="mb-3 horarios-select">
            <label>Seleccione un horario</label>
            <div className='btn-carrusel'>
                <span className="line"></span>
                {profesional ? horarios.map((h, index) => (
                    <button disabled={profesional ? false : true} className={`btn`} key={index} value={h} onClick={(e) => setHorario(e.target.value)}>
                        {h}
                    </button>
                )) : horariosDeMuestra.map((h, index) => (
                    <button disabled={profesional ? false : true} className={`btn`} key={index} value={h} onClick={(e) => setHorario(e.target.value)}>
                        {h}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default HorarioSelect;
