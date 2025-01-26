import React, { useState } from 'react';
import ModalReservaDeEstilista from './ModalReservaDeEstilista';

const ReservaDeEstilista = () => {
    const [displayModal, setDisplayModal] = useState("none")
    const handleClick = () => {
        setDisplayModal("inline-block")
    }
    return (
        <div>
            <button onClick={handleClick} className='btn fw-bold fs-4 position-absolute top-0  end-0 '
                style={{ backgroundColor: "#f85b00", color: "#fff", margin: "100px 30px 0 0" }}>
                <i className="bi bi-plus" style={{ color: "#fff" }}></i>
                Realizar una Reserva
            </button>
            <ModalReservaDeEstilista display={displayModal} setDisplay={setDisplayModal}></ModalReservaDeEstilista>
        </div>
    );
};

export default ReservaDeEstilista;
