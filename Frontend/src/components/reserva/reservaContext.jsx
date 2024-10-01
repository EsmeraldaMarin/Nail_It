import React, { useState } from 'react';
import ReservaCard from './realizar_reserva/ReservaCard';
import CardInfoReserva from './confirmar_reserva/CardInfoReserva';
import CardInfoTranferencia from './adjuntar_comprobante/CardInfoTransferencia'
import CardOpExitosa from './mensaje_exitoso/CardOpExitosa'
import axios from '../../axiosConfig/axiosConfig';

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
    const registrarReserva = async () => {
        try {
            console.log(reservaData)
            const response = await axios.post(`/reserva`, {
                horaInicio: reservaData.horario,
                comprobante: reservaData.comprobante.name,
                fecha: reservaData.fecha,
                montoSenia: reservaData.monto,
                montoTotal: 200.00,
                cliente: "Juan Pérez",
                id_servicio: reservaData.servicio,
                id_cliente: "1",
                estado: "pendiente"
            });
            setReservaData({});
            console.log(response)
        } catch (error) {
            console.error('Error al realizar la reserva', error);
        }
    };
    return (
        <div>
            {pasoActual === 1 && <ReservaCard setPasoActual={setPasoActual} reservaData={reservaData} setReservaData={setReservaData} />}
            {pasoActual === 2 && <CardInfoReserva setPasoActual={setPasoActual} reservaData={reservaData} />}
            {pasoActual === 3 && <CardInfoTranferencia setPasoActual={setPasoActual} reservaData={reservaData} setReservaData={setReservaData} registrarReserva={registrarReserva} />}
            {pasoActual === 4 && <CardOpExitosa />}
        </div>
    );
}

export default ReservaContext;
