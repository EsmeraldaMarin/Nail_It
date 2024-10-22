import "./Reservas.scss";
import { format, isSameDay } from 'date-fns';
import { es } from 'date-fns/locale';
import React, { useState, useEffect } from 'react';
import axios from '../../axiosConfig/axiosConfig';

const ReservasConfirmadas = () => {
    const [reservas, setReservas] = useState([]);
    const userId = localStorage.getItem('userId');

    // Función para formatear la fecha
    const formatearFecha = (fecha) => {
        const fechaLocal = new Date(new Date(fecha).getTime() + new Date().getTimezoneOffset() * 60000);
        return format(fechaLocal, 'EEEE dd/MM', { locale: es });
    };

    // Obtener fecha de hoy
    const hoy = new Date();

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

    // Filtrar reservas para hoy y del estilista
    const reservasEstilista = reservas.filter(
        reserva => reserva.estado === "confirmada" &&
            reserva.id_profesional === userId &&
            isSameDay(new Date(reserva.fecha), hoy) // Filtrar por fecha de hoy
    );

    // Filtrar todas las reservas confirmadas para hoy
    const reservasConfirmadas = reservas.filter(
        reserva => reserva.estado === "confirmada" &&
            isSameDay(new Date(reserva.fecha), hoy) // Filtrar por fecha de hoy
    );

    // Función para renderizar filas de la tabla
    const renderFilasReserva = (reservasFiltradas) => {
        return reservasFiltradas.map((reserva, index) => (
            <tr key={index}>
                <td className="text-capitalize text-wrap" style={{ width: "10rem" }}>{reserva.Servicio.nombre}</td>
                <td className="text-capitalize text-wrap" style={{ width: "8rem" }}>{reserva.Cliente.nombre} {reserva.Cliente.apellido}</td>
                <td>{reserva.Cliente.numero}</td>
                <td className="text-capitalize">{formatearFecha(reserva.fecha)}</td>
                <td>{reserva.horaInicio}</td>
                <td>${reserva.montoTotal}</td>
                <td>${reserva.montoSenia}</td>
                <td className="fs-5"><strong>${reserva.montoTotal - reserva.montoSenia}</strong></td>
                <td>
                    <button type="button" className="me-1 btn btn-primary">Llegó</button>
                    <button type="button" className="me-1 btn btn-danger">No llegó</button>
                    <button type="button" className="btn btn-success">Cobrado</button>
                </td>
            </tr>
        ));
    };

    return (
        <div className='container-fluid Reservas'>
            <h3>Gestor de turnos</h3>

            {/* Reservas del estilista */}
            <h4 className="py-3">Tus turnos de hoy</h4>
            <div className="table-ctn mis-reservas pb-2">
                <div className="table-responsive">
                    <table className="table">
                        <thead className="table-primary">
                            <tr>
                                <th scope="col">Servicio</th>
                                <th scope="col">Cliente</th>
                                <th scope="col">Teléfono</th>
                                <th scope="col">Fecha Turno</th>
                                <th scope="col">Hora Turno</th>
                                <th scope="col">Precio servicio</th>
                                <th scope="col">Importe abonado</th>
                                <th scope="col">Importe a cobrar</th>
                                <th scope="col">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reservasEstilista.length > 0
                                ? renderFilasReserva(reservasEstilista)
                                : <tr><td colSpan="9">No tienes reservas confirmadas para hoy</td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Reservas generales */}
            <h4 className="py-3">Turnos generales de hoy</h4>
            <div className="table-ctn reservas-gral pb-2">
                <div className="table-responsive">
                    <table className="table">
                        <thead className="table-dark">
                            <tr>
                                <th scope="col">Estilista</th>
                                <th scope="col">Servicio</th>
                                <th scope="col">Cliente</th>
                                <th scope="col">Teléfono</th>
                                <th scope="col">Fecha Turno</th>
                                <th scope="col">Hora Turno</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reservasConfirmadas.length > 0
                                ? reservasConfirmadas.map((reserva, index) => (
                                    <tr key={index}>
                                        <th className="text-uppercase">{reserva.Admin.nombre}</th>
                                        <td>{reserva.Servicio.nombre}</td>
                                        <td className="text-capitalize ">{reserva.Cliente.nombre} {reserva.Cliente.apellido}</td>
                                        <td>{reserva.Cliente.numero}</td>
                                        <td className="text-capitalize">{formatearFecha(reserva.fecha)}</td>
                                        <td>{reserva.horaInicio}</td>
                                    </tr>
                                ))
                                : <tr><td colSpan="6">No hay reservas confirmadas para hoy</td></tr>}
                        </tbody>
                    </table></div>
            </div>
        </div>
    );
};

export default ReservasConfirmadas;
