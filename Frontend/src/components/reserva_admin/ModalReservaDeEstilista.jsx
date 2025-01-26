import React from 'react';
import ReservaContext from '../reserva/reservaContext';
import './ModalReservaDeEstilista.scss'

const ModalReservaDeEstilista = ({ display, setDisplay }) => {
    const handleClick = () => {
        setDisplay("none")
    }
    if (display === "none") return
    return (
        <div style={{ display: { display } }} className='modalReservaEstilista' >
            <button className='btn cerrarModal bi bi-x' onClick={handleClick}></button>
            <ReservaContext></ReservaContext>
        </div>
    );
};

export default ModalReservaDeEstilista;
