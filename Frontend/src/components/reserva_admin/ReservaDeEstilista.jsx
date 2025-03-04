import React, { useState } from 'react';
import ModalReservaDeEstilista from './subComponentes/ModalReservaDeEstilista';

const ReservaDeEstilista = () => {
    const [displayModal, setDisplayModal] = useState("none")
    const handleClick = () => {
        setDisplayModal("inline-block")
    }
    return (
        <div>
            <button onClick={handleClick} className='btn fw-bold fs-6'
                style={{ backgroundColor: "#f85b00", color: "#fff"}}>
                Realizar una Reserva <i className="bi bi-plus-circle ms-2"></i>
            </button>
            <ModalReservaDeEstilista display={displayModal} setDisplay={setDisplayModal}></ModalReservaDeEstilista>
        </div>
    );
};

export default ReservaDeEstilista;
