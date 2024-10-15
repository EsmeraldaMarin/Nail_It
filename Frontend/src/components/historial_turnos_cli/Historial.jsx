import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import React, { useState, useEffect } from 'react';
import axios from '../../axiosConfig/axiosConfig';
import { useNavigate } from 'react-router-dom';
import Header from '../header/Header';
const Historial_turnos = () => {
    const [reservas, setReservas] = useState([]);
    const userId = localStorage.getItem('userId');

    const formatearFecha = (fecha) => format(new Date(fecha), 'EEEE dd/MM', { locale: es });

    useEffect(() => {
        const fetchReservas = async () => {
            try {
                const response = await axios.get('/reserva');
                setReservas(response.data);
            } catch (error) {
                console.error('Error al obtener las reservas', error);
            }
        };
        fetchReservas();
    }, []);

    // Función para renderizar filas de la tabla
    const renderFilasReserva = (reservasFiltradas) => {
        return (
            <ul>
                {reservasFiltradas.map((reserva, index) => (
                    <li key={index}>
                        <p><strong>Admin:</strong> {reserva.Admin.nombre}</p>
                        <p><strong>Fecha:</strong> {formatearFecha(reserva.fecha)}</p>
                        <p><strong>Hora de Inicio:</strong> {reserva.horaInicio}</p>
                        <p><strong>Monto de Señal:</strong> {reserva.montoSenia}</p>
                        <p><strong>Monto Total:</strong> ${reserva.montoTotal}</p>
                        <p><strong>Servicio:</strong> {reserva.Servicio.nombre}</p>
                        <p><strong>Especialidad del Servicio:</strong> {reserva.Servicio.Especialidad.nombre}</p>
                        <p>{reserva.estado}</p>
                    </li>
                ))}
            </ul>
        );
    };

    // Filtrar reservas por usuario
    const reservasCliente = reservas.filter(
        reserva => reserva.id_cliente === userId
    );
    const navigate = useNavigate()
    const handleRedirect = () => {

        navigate('/inicio')
    }

    return (
        <div>
            <Header></Header>
            <div className='container-fluid Reservas'>

                <h4>Tus Turnos</h4>
                <div className="table-ctn " style={{ overflowX: "auto" }}>

                    {/* <div>

                        <p><strong>Profesional:</strong> Euge</p>
                        <p><strong>Fecha:</strong> 17/10/2024</p>
                        <p><strong>Hora de Inicio:</strong> 18:00 hs</p>
                        <p><strong>Monto de Señal:</strong> $3000</p>
                        <p><strong>Monto Total:</strong> $10000</p>
                        <p><strong>Servicio:</strong> Manicure</p>
                        <p><strong>Especialidad del Servicio:</strong> Manicure de manos</p>
                        <p>Confirmada</p>

                    </div> */}
                    {reservasCliente.length > 0 ? renderFilasReserva(reservasCliente): <tr><td colSpan="5">No tienes turnos</td></tr>}

                </div>
                <div>
                    <button className='btn btn-secondary misTurnos-btn' onClick={handleRedirect}>Volver</button>
                </div>

            </div>
        </div>
    );

}

export default Historial_turnos