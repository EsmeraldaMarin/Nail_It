import React, { useState } from 'react';
import ModalReservaDeEstilista from './subComponentes/ModalReservaDeEstilista';

const ReservaDeEstilista = () => {
    const [displayModal, setDisplayModal] = useState("none")
    const handleClick = () => {
        setDisplayModal("inline-block")
    }
    return (
        <div>
            <button onClick={handleClick} className='btn fw-bold fs-4'
                style={{ backgroundColor: "#f85b00", color: "#fff"}}>
                <i className="bi bi-plus" style={{ color: "#fff" }}></i>
                Realizar una Reserva
            </button>
            <ModalReservaDeEstilista display={displayModal} setDisplay={setDisplayModal}></ModalReservaDeEstilista>
        </div>
    );
};

export default ReservaDeEstilista;
