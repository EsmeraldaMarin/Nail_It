import "./Reservas.scss";
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import React, { useState, useEffect } from 'react';
import axios from '../../axiosConfig/axiosConfig';

const ReservasConfirmadas = () => {
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
                <td>{reserva.Cliente.nombre}</td>
                <td>{reserva.Cliente.numero}</td>
                <td>{formatearFecha(reserva.fecha)}</td>
                <td>{reserva.horaInicio}</td>
                <td>${reserva.montoTotal}</td>
            </tr>
        ));
    };

    // Filtrar reservas por estilista
    const reservasEstilista = reservas.filter(
        reserva => reserva.estado === "confirmada" && reserva.id_profesional === userId
    );

    // Filtrar reservas para mostrar todas las confirmadas
    const reservasConfirmadas = reservas.filter(
        reserva => reserva.estado === "confirmada"
    );

    return (
        <div className='container-fluid Reservas'>
            <h3>Gestor de Reservas</h3>

            {/* Reservas del estilista */}
            <h4>Tus reservas</h4>
            <div className="table-ctn mis-reservas" style={{ overflowX: "auto" }}>
                <table className="table">
                    <thead>
                        <tr>
                            <th scope="col">Cliente</th>
                            <th scope="col">Número</th>
                            <th scope="col">Fecha Turno</th>
                            <th scope="col">Hora Turno</th>
                            <th scope="col">Monto</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reservasEstilista.length > 0 
                            ? renderFilasReserva(reservasEstilista)
                            : <tr><td colSpan="5">No tienes reservas confirmadas</td></tr>}
                    </tbody>
                </table>
            </div>

            {/* Reservas generales */}
            <h4>Reservas de hoy</h4>
            <div className="table-ctn reservas-gral" style={{ overflowX: "auto" }}>
                <table className="table">
                    <thead>
                        <tr>
                            <th scope="col">Estilista</th>
                            <th scope="col">Cliente</th>
                            <th scope="col">Número</th>
                            <th scope="col">Fecha Turno</th>
                            <th scope="col">Hora Turno</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reservasConfirmadas.length > 0 
                            ? reservasConfirmadas.map((reserva, index) => (
                                <tr key={index}>
                                    <td>{reserva.Admin.nombre}</td>
                                    <td>{reserva.Cliente.nombre}</td>
                                    <td>{reserva.Cliente.numero}</td>
                                    <td>{formatearFecha(reserva.fecha)}</td>
                                    <td>{reserva.horaInicio}</td>
                                </tr>
                              ))
                            : <tr><td colSpan="6">No hay reservas confirmadas</td></tr>}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ReservasConfirmadas;
