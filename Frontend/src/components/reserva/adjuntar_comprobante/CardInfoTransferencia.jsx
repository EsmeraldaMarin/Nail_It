import React from 'react';

const CardInfoTransferencia = ({ pasos, setPasoActual }) => {
    const handleConfirm = () => {

        // Lógica de confirmación de reserva aquí (opcional)
        // Luego de confirmar, redirige a otra vista
        setPasoActual(pasos[3])
    };
    return (
        <div >
            INFORMACION PARA TRANSFERENCIA
            <button onClick={handleConfirm} className="btn btn-primary mt-3 btn-continuar">
                Adjuntar Comprobante
            </button>
        </div>
    );
};

export default CardInfoTransferencia;
