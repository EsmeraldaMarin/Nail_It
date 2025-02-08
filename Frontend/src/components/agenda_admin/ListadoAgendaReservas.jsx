import React, { useState, useEffect } from 'react';
import axios from '../../axiosConfig/axiosConfig';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const ListadoAgendaReservas = ({ reservas, handleCancelarReserva }) => {

    const userId = localStorage.getItem('userId');
    const formatearFecha = (fecha) => {
        const fechaLocal = new Date(new Date(fecha).getTime() + new Date().getTimezoneOffset() * 60000);
        return format(fechaLocal, 'EEEE dd/MM', { locale: es });
    };

    const reservasEstilista = reservas.filter(reserva => reserva.id_profesional === userId);

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
                        style={{ color: "#000", textDecoration: "none" }}
                    >
                        <i className="bi bi-whatsapp" style={{ color: "green" }}> </i>
                        {reserva.Cliente ? reserva.Cliente.numero : reserva.telefono_cliente}
                    </a>
                </td>
                <td className="text-capitalize">{formatearFecha(reserva.fecha)}</td>
                <td>{reserva.horaInicio}</td>
                <td>{formatPrice(reserva.montoTotal)}</td>
                <td>{formatPrice(reserva.montoSenia)}</td>
                <td className="fs-5"><strong>{formatPrice(reserva.montoTotal - reserva.montoSenia)}</strong></td>
                <td><button className='btn btn-danger' onClick={() => handleCancelarReserva(reserva.id)}>Cancelar</button></td>

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
            <h4 className="pt-3">Reservas confirmadas</h4>
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
                            : <tr><td colSpan="5">No tienes reservas confirmadas</td></tr>}
                    </tbody>
                </table>
            </div>

        </div>
    );
};

export default ListadoAgendaReservas;
