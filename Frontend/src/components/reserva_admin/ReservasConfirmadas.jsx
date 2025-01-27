import "./Reservas.scss";
import { format, isSameDay } from 'date-fns';
import { es } from 'date-fns/locale';
import React, { useState, useEffect } from 'react';
import axios from '../../axiosConfig/axiosConfig';
import ReservaDeEstilista from "./ReservaDeEstilista";
const ReservasConfirmadas = () => {
    const [reservas, setReservas] = useState([]);
    const userId = localStorage.getItem('userId');

    const formatearFecha = (fecha) => {
        const fechaLocal = new Date(new Date(fecha).getTime() + new Date().getTimezoneOffset() * 60000);
        return format(fechaLocal, 'EEEE dd/MM', { locale: es });
    };

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

    // Obtener la fecha de hoy
    const hoy = new Date();

    // Filtrar reservas por estilista y fecha de hoy
    const reservasEstilista = reservas.filter(
        reserva =>
            reserva.estado === "confirmada" &&
            reserva.id_profesional === userId &&
            isSameDay(new Date(new Date(new Date(reserva.fecha).getTime() + new Date().getTimezoneOffset() * 60000)), hoy) // Comparar la fecha con el día de hoy
    )

    // Filtrar reservas generales confirmadas y fecha de hoy
    const reservasConfirmadas = reservas.filter(
        reserva =>
            reserva.estado === "confirmada" &&
            isSameDay(new Date(new Date(new Date(reserva.fecha).getTime() + new Date().getTimezoneOffset() * 60000)), hoy) // Comparar la fecha con el día de hoy
    )

    const renderFilasReserva = (reservasFiltradas) => {
        return reservasFiltradas.map((reserva, index) => (
            <tr key={index}>
                <td className="text-capitalize text-wrap" style={{ width: "11rem" }}>{reserva.Servicio.nombre}</td>
                <td className="text-capitalize text-wrap" style={{ width: "8rem" }}>
                    {reserva.Cliente
                        ? `${reserva.Cliente.nombre} ${reserva.Cliente.apellido}`
                        : `${reserva.nombre_cliente} ${reserva.apellido_cliente}`}
                </td>
                <td>
                    <a
                        href={`https://wa.me/${reserva.Cliente ? reserva.Cliente.numero : reserva.telefono_cliente}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{color:"#000", textDecoration:"none"}}
                    >
                        <i className="bi bi-whatsapp" style={{color:"green"}}> </i>
                        {reserva.Cliente ? reserva.Cliente.numero : reserva.telefono_cliente}
                    </a>
                </td>
                <td className="text-capitalize">{formatearFecha(reserva.fecha)}</td>
                <td>{reserva.horaInicio}</td>
                <td>{formatPrice(reserva.montoTotal)}</td>
                <td>{formatPrice(reserva.montoSenia)}</td>
                <td className="fs-5"><strong>{formatPrice(reserva.montoTotal - reserva.montoSenia)}</strong></td>
                <td>
                    <button type="button" className="me-1 btn btn-primary">Llegó</button>
                    <button type="button" className="me-1 btn btn-danger">No llegó</button>
                    <button type="button" className="btn btn-success">Cobrado</button>
                </td>
            </tr>
        ));
    };
    const formatPrice = (price) => {
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS',
        }).format(price);
    };
    return (
        <div className='container-fluid Reservas'>
            <div className="d-flex justify-content-between">
                <h3>Gestor de turnos</h3>
                <ReservaDeEstilista></ReservaDeEstilista>

            </div>
            <h4 className="pt-3">Mis turnos de hoy</h4>
            <div className="table-ctn mis-reservas table-responsive">
                <table className="table ">
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
                            <th scope="col"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {reservasEstilista.length > 0
                            ? renderFilasReserva(reservasEstilista)
                            : <tr><td colSpan="5">No tienes reservas confirmadas para hoy</td></tr>}
                    </tbody>
                </table>
            </div>

            {/* Reservas generales */}
            <h4 className="pt-5">Todos los turnos de hoy</h4>
            <div className="table-ctn reservas-gral table-responsive">
                <table className="table">
                    <thead className="table-dark">
                        <tr>
                            <th scope="col">Operadora</th>
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
                                    <th className="text-uppercase" style={{ backgroundColor: "#eee" }}>{reserva.Admin.nombre}</th>
                                    <td style={{ width: "20rem" }}>{reserva.Servicio.nombre}</td>
                                    <td className="text-capitalize">{reserva.Cliente ? reserva.Cliente.nombre + " " + reserva.Cliente.apellido : reserva.nombre_cliente + " " + reserva.nombre_cliente}</td>
                                    <td>{reserva.Cliente ? reserva.Cliente.numero : reserva.telefono_cliente}</td>
                                    <td className="text-capitalize">{formatearFecha(reserva.fecha)}</td>
                                    <td>{reserva.horaInicio}</td>
                                </tr>
                            ))
                            : <tr><td colSpan="6">No hay reservas confirmadas para hoy</td></tr>}
                    </tbody>
                </table>
            </div>
        </div>
    );
};


export default ReservasConfirmadas;
