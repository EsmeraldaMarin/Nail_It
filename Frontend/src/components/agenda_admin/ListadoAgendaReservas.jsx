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


    //mejora: esto es necesario porque el valor de montoSenia por alguna razon se guarda como string y no deberia ser asi
    function convertirAFloat(valor) {
        // Reemplazar la coma por un punto y convertir a número
        if (typeof valor === "string") {
            return parseFloat(valor.replace(",", "."));
        }
        return valor
    }

    const formatPrice = (price) => {
        if (typeof price === "string") {
            price = parseFloat(price.replace(",", "."));
        }
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(price);
    };
    const reservasEstilista = reservas.filter(reserva => {
        //mejora: esta funcionalidad se aplica en varios lugares porqeu me toma una fecha anteriror a la que deberia ser
        const fechaReserva = new Date(new Date(reserva.fecha).getTime() + new Date().getTimezoneOffset() * 60000);
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0); // Ajustar a medianoche para comparar solo la fecha
        return fechaReserva >= hoy && reserva.id_profesional === userId;
    });

    const renderFilasReserva = (reservasFiltradas) => {
        return reservasFiltradas.map((reserva, index) => (
            <tr key={index}>
                <td className="text-capitalize table-active">{formatearFecha(reserva.fecha)}</td>
                <td className='table-active'>{reserva.horaInicio}</td>
                <td className="text-capitalize">{reserva.Servicio.nombre}</td>
                <td className="text-capitalize" width={"11em"}>
                    {reserva.Cliente
                        ? `${reserva.Cliente.nombre} ${reserva.Cliente.apellido}`
                        : `${reserva.nombre_cliente} ${reserva.apellido_cliente}`}
                </td>
                <td className='text-center' style={{ width: "70px" }}>
                    <a
                        className='wpp-btn'
                        href={`https://wa.me/${reserva.Cliente ? reserva.Cliente.numero : reserva.telefono_cliente}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: "#000", textDecoration: "none" }}
                    >
                        <i className="bi bi-whatsapp" style={{ color: "green" }}> </i>
                    </a>
                    <span className='display-on-hover'>{reserva.Cliente ? reserva.Cliente.numero : reserva.telefono_cliente}</span>
                </td>
            
                <td className='text-end'>{formatPrice(reserva.montoTotal)}</td>
                <td className='text-end'>{formatPrice(reserva.montoSenia)}</td>
                <td className="fs-5 text-end"><strong>{formatPrice((reserva.montoTotal) - convertirAFloat(reserva.montoSenia))}</strong></td>
                <td><button className='btn btn-danger' onClick={() => handleCancelarReserva(reserva.id)}>Cancelar</button></td>

            </tr>
        ));
    };


    return (
        <div className='container-fluid Reservas'>
            <h4 className="pt-3">Reservas confirmadas</h4>
            <div className="table-ctn mis-reservas table-responsive">
                <table className="table ">
                    <thead className="table-primary">
                        <tr>
                            <th scope="col">Fecha Turno</th>
                            <th scope="col">Hora Turno</th>
                            <th scope="col">Servicio</th>
                            <th scope="col">Cliente</th>
                            <th scope="col">Teléfono</th>
                            <th scope="col" className='text-end'>Precio servicio</th>
                            <th scope="col" className='text-end'>Importe abonado</th>
                            <th scope="col" className='text-end'>Importe a cobrar</th>
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
