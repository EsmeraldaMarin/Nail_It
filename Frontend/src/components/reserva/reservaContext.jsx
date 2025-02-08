import React, { useEffect, useState } from 'react';
import ReservaCard from './realizar_reserva/ReservaCard';
import CardInfoReserva from './confirmar_reserva/CardInfoReserva';
import CardOpExitosa from './mensaje_exitoso/CardOpExitosa'
import axios from '../../axiosConfig/axiosConfig';
import ErrorEnRealizarReserva from '../errors/ErrorEnRealizarReserva'
function ReservaContext({ esDeEstilista = false }) {
    const [pasoActual, setPasoActual] = useState(1); // Estado para manejar el paso actual
    const [reservaData, setReservaData] = useState({
        servicio: null,
        tipoServicio: null,
        fecha: '',
        horario: '',
        profesional: '',
        precio: null,
        montoSenia: '',
        comprobante: null,
        userId: localStorage.getItem('userId'),
        servicio_data: null,
        profesional_data: null,
        horarios_disponibles: null,
        horariosXprofesional: null,
    }); // Estado para los datos de la reserva
    const registrarReserva = async () => {

        try {            
            const response = await axios.post(`/reserva`, {
                horaInicio: reservaData.horario,
                comprobante: reservaData.comprobante?.name || 'sin comprobante',
                fecha: reservaData.fecha,
                montoSenia: reservaData.montoSenia,
                montoTotal: reservaData.precio,
                id_servicio: reservaData.servicio,
                id_cliente: reservaData.userId,
                id_profesional: reservaData.profesional,
                estado: "pendiente"
            });
            
            setPasoActual(3)
            setReservaData({});
        } catch (error) {
            console.error('Error al realizar la reserva', error);
            setPasoActual(4)
        }
    };
    return (
        <div className='p-3'>
            {pasoActual === 1 && <ReservaCard setPasoActual={setPasoActual} reservaData={reservaData} setReservaData={setReservaData} />}
            {pasoActual === 2 && <CardInfoReserva esDeEstilista={esDeEstilista} setPasoActual={setPasoActual} reservaData={reservaData} setReservaData={setReservaData} registrarReserva={registrarReserva} />}
            {pasoActual === 3 && <CardOpExitosa setPasoActual={setPasoActual} esDeEstilista={esDeEstilista} />}
            {pasoActual === 4 && <ErrorEnRealizarReserva />}
        </div>
    );
}

export default ReservaContext;
