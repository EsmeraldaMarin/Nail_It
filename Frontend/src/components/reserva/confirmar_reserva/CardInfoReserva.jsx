import React from 'react';

const CardInfoReserva = ({ pasos, setPasoActual }) => {
    const handleConfirm = () => {

        // Lógica de confirmación de reserva aquí (opcional)
        // Luego de confirmar, redirige a otra vista
        setPasoActual(pasos[2])
    };
    return (
        <div >
            CONFIRMAR RESERVA
            <button onClick={handleConfirm} className="btn btn-primary mt-3 btn-continuar">
                Realizar Senia
            </button>
        </div>
    );
};

export default CardInfoReserva;
