import React, { useEffect, useState } from 'react';
import ReservaCard from './realizar_reserva/ReservaCard';
import CardInfoReserva from './confirmar_reserva/CardInfoReserva';
import CardOpExitosa from './mensaje_exitoso/CardOpExitosa'
import axios from '../../axiosConfig/axiosConfig';
import ErrorEnRealizarReserva from '../errors/ErrorEnRealizarReserva'
import { Link } from 'react-router-dom';
function ReservaContext({ esDeEstilista = false }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
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
    useEffect(() => {
        setIsAuthenticated(localStorage.getItem("auth"))
    }, [])
    const registrarReserva = async () => {
        try {
            const response = await axios.post(`/reserva`, {
                horaInicio: reservaData.horario,
                comprobante: reservaData.comprobante || 'sin comprobante',
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

            {(isAuthenticated && pasoActual === 1) && <ReservaCard setPasoActual={setPasoActual} reservaData={reservaData} setReservaData={setReservaData} />}
            {(isAuthenticated && pasoActual === 2) && <CardInfoReserva esDeEstilista={esDeEstilista} setPasoActual={setPasoActual} reservaData={reservaData} setReservaData={setReservaData} registrarReserva={registrarReserva} />}
            {(isAuthenticated && pasoActual === 3) && <CardOpExitosa setPasoActual={setPasoActual} esDeEstilista={esDeEstilista} />}
            {(isAuthenticated && pasoActual === 4) && <ErrorEnRealizarReserva />}
            {!isAuthenticated && <div className='card' style={{minHeight:"calc(50vh - 60px)"}}>
                <div className="card-body d-flex flex-column justify-content-center align-items-center">
                    <i className='bi bi-exclamation-circle' style={{fontSize:"40px"}}></i>
                    <h4 className='text-center mb-3'>Para poder realizar una reserva es necesario que inicie sesión</h4>
                    <Link to="/login">Iniciar Sesión</Link>
                </div>
            </div>}
        </div>
    );
}

export default ReservaContext;
