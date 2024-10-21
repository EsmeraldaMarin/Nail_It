import React, { useEffect, useState } from 'react';
import ReservaCard from './realizar_reserva/ReservaCard';
import CardInfoReserva from './confirmar_reserva/CardInfoReserva';
import CardOpExitosa from './mensaje_exitoso/CardOpExitosa'
import axios from '../../axiosConfig/axiosConfig';
import ErrorEnRealizarReserva from '../errors/ErrorEnRealizarReserva'
function ReservaContext() {
    const [pasoActual, setPasoActual] = useState(1); // Estado para manejar el paso actual
    const [allReservas, setAllReservas] = useState([]);
    const [comprobante, setComprobante] = useState(null);
    const [reservaData, setReservaData] = useState({
        servicio: null,
        tipoServicio: null,
        fecha: '',
        horario: '',
        profesional: '',
        precio: null,
        servicio_data: null,
        profesional_data: null,
        horarios_disponibles: null,
        horariosXprofesional: null,
    }); // Estado para los datos de la reserva

    //esta funcion se ejecuta cuando el cliente esta en el paso 2 y desea modificar una reserva
    const modificarReserva = (indice_reserva) => {
        console.log(indice_reserva);
        setReservaData(allReservas[indice_reserva])
        setPasoActual(1)
    }
    
    //debe recorrer todas las reservas ya confirmadas para hacer el post de cada una por separado.
    const registrarReserva = () => {
        const userId = localStorage.getItem('userId');
        try {
            allReservas.forEach(async (reserva) => {
                const response = await axios.post(`/reserva`, {
                    horaInicio: reserva.horario,
                    comprobante: comprobante,
                    fecha: reserva.fecha,
                    montoSenia: 200,
                    montoTotal: reserva.precio,
                    id_servicio: reserva.servicio,
                    id_cliente: userId,
                    id_profesional: reserva.profesional,
                    estado: "pendiente"
                });
            })

            setPasoActual(3)
            setReservaData({});
        } catch (error) {
            console.error('Error al realizar la reserva', error);
            setPasoActual(4)
        }
    };

    return (
        <div>
            {pasoActual === 1 && <ReservaCard
                setPasoActual={setPasoActual}
                reservaData={reservaData}
                setReservaData={setReservaData}
                setAllReservas={() => {
                    setAllReservas([...allReservas, reservaData])
                    setReservaData({})
                }} />}
            {pasoActual === 2 && <CardInfoReserva setPasoActual={setPasoActual} allReservas={allReservas} comprobante={comprobante} setComprobante={setComprobante} registrarReserva={registrarReserva} modificarReserva={modificarReserva} />}
            {pasoActual === 3 && <CardOpExitosa />}
            {pasoActual === 4 && <ErrorEnRealizarReserva />}
        </div>
    );
}

export default ReservaContext;
