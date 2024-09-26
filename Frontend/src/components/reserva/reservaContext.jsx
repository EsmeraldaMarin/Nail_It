import React, { useState } from 'react';
import ReservaCard from './realizar_reserva/ReservaCard';
import CardInfoReserva from './confirmar_reserva/CardInfoReserva';
import CardInfoTranferencia from './adjuntar_comprobante/CardInfoTransferencia'
import CardOpExitosa from './mensaje_exitoso/CardOpExitosa'

function ReservaContext() {
    const [pasoActual, setPasoActual] = useState(1); // Estado para manejar el paso actual
    const [reservaData, setReservaData] = useState({
        servicio: null,
        tipoServicio: null,
        fecha: '',
        horario: '',
        profesional: '',
        monto: 0,
        comprobante: null
    }); // Estado para los datos de la reserva

    return (
        <div>
            {pasoActual === 1 && <ReservaCard setPasoActual={setPasoActual} reservaData={reservaData} setReservaData={setReservaData} />}
            {pasoActual === 2 && <CardInfoReserva setPasoActual={setPasoActual} reservaData={reservaData} />}
            {pasoActual === 3 && <CardInfoTranferencia setPasoActual={setPasoActual} reservaData={reservaData} setReservaData={setReservaData} />}
            {pasoActual === 4 && <CardOpExitosa />}
        </div>
    );
}

export default ReservaContext;
