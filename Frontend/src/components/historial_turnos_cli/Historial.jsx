import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import React, { useState, useEffect } from 'react';
import axios from '../../axiosConfig/axiosConfig';
import { useNavigate } from 'react-router-dom';

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
        return reservasFiltradas.map((reserva, index) => (
            <tr key={index}>
                <td>{reserva.Admin.nombre}</td>
                <td>{formatearFecha(reserva.fecha)}</td>
                <td>{reserva.horaInicio}</td>
                <td>{reserva.montoSenia}</td>
                <td>${reserva.montoTotal}</td>
                <td>${reserva.Servicio.nombre}</td>
                <td>${reserva.Servicio.Especialidas.nombre}</td>
                <td>${reserva.estado}</td>

            </tr>
        ));
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
        <div className='container-fluid Reservas'>

            <h4>Tus Turnos</h4>
            <div className="table-ctn mis-reservas" style={{ overflowX: "auto" }}>
                <table className="table">
                    <thead>
                        <tr>
                            <th scope="col">Profesional</th>    
                            <th scope="col">Fecha Turno</th>
                            <th scope="col">Hora Turno</th>
                            <th scope="col">Monto seña</th>
                            <th scope="col">Monto Total</th>
                            <th scope="col">Servicio</th>
                            <th scope="col">Especialidad</th>
                            <th scope="col">Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reservasCliente.length > 0 
                            ? renderFilasReserva(reservasCliente)
                            : <tr><td colSpan="5">No tienes turnos</td></tr>}
                    </tbody>
                </table>
            </div>
            <div>
            <button className='btn btn-secondary misTurnos-btn' onClick={handleRedirect}>Volver</button>
            </div>
            
        </div>
    );

}

export default Historial_turnos