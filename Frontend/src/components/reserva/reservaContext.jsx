import React, { useState } from 'react';
import ReservaCard from './realizar_reserva/ReservaCard';
import CardInfoReserva from './confirmar_reserva/CardInfoReserva';
import CardInfoTranferencia from './adjuntar_comprobante/CardInfoTransferencia'
import CardOpExitosa from './mensaje_exitoso/CardOpExitosa'
import axios from '../../axiosConfig/axiosConfig';
import ErrorEnRealizarReserva from '../errors/ErrorEnRealizarReserva'
function ReservaContext() {
    const [pasoActual, setPasoActual] = useState(1); // Estado para manejar el paso actual
    const [reservaData, setReservaData] = useState({
        servicio: null,
        tipoServicio: null,
        fecha: '',
        horario: '',
        profesional: '',
        precio: null,
        comprobante: null,
        servicio_data:null,
        profesional_data:null,
    }); // Estado para los datos de la reserva
    const registrarReserva = async () => {
        const userId = localStorage.getItem('userId');
        try {
            console.log(reservaData)
            const response = await axios.post(`/reserva`, {
                horaInicio: reservaData.horario,
                comprobante: reservaData.comprobante.name,
                fecha: reservaData.fecha,
                montoSenia: 200,
                montoTotal: reservaData.precio,
                id_servicio: reservaData.servicio,
                id_cliente: userId,
                id_profesional: reservaData.profesional,
                estado: "pendiente"
            });

            setPasoActual(4)
            setReservaData({});
        } catch (error) {
            console.error('Error al realizar la reserva', error);
            setPasoActual(5)
        }
    };
    return (
        <div>
            {pasoActual === 1 && <ReservaCard setPasoActual={setPasoActual} reservaData={reservaData} setReservaData={setReservaData} />}
            {pasoActual === 2 && <CardInfoReserva setPasoActual={setPasoActual} reservaData={reservaData} />}
            {pasoActual === 3 && <CardInfoTranferencia setPasoActual={setPasoActual} reservaData={reservaData} setReservaData={setReservaData} registrarReserva={registrarReserva} />}
            {pasoActual === 4 && <CardOpExitosa />}
            {pasoActual === 5 && <ErrorEnRealizarReserva />}
        </div>
    );
}

export default ReservaContext;
