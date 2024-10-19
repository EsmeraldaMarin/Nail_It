import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import React, { useState, useEffect } from 'react';
import axios from '../../axiosConfig/axiosConfig';
import { useNavigate } from 'react-router-dom';
import "./Historial.scss"

const Historial_turnos = () => {
    const [reservas, setReservas] = useState([]);
    const userId = localStorage.getItem('userId');

    const formatearFecha = (fecha) => {
        const fechaLocal = new Date(new Date(fecha).getTime() + new Date().getTimezoneOffset() * 60000);
        return format(fechaLocal, 'EEEE dd/MM', { locale: es });
    };

    useEffect(() => {
        const fetchReservas = async () => {
            try {
                const response = await axios.get(`/reserva/user/${userId}`);
                setReservas(response.data);
            } catch (error) {
                console.error('Error al obtener las reservas', error);
            }
        };
        fetchReservas();
    }, []);

    const obtenerClasesCard = (estado) => {
        switch (estado) {
            case 'cancelada':
                return {
                    card: 'card border-danger mb-3',
                    header: 'card-header bg-transparent border-danger',
                    footer: 'card-footer bg-transparent border-danger',
                };
            case 'pendiente':
                return {
                    card: 'card border-warning mb-3',
                    header: 'card-header bg-transparent border-warning',
                    footer: 'card-footer bg-transparent border-warning',
                };
            case 'confirmada':
                return {
                    card: 'card border-success mb-3',
                    header: 'card-header bg-transparent border-success',
                    footer: 'card-footer bg-transparent border-success',
                };
            default:
                return {
                    card: 'card border-secondary mb-3',
                    header: 'card-header bg-transparent border-secondary',
                    footer: 'card-footer bg-transparent border-secondary',
                };
        }
    };

    const renderFilasReservas = (reservas) => {
        return (
            <div className="row">
                {reservas.map((reserva, index) => {
                    const clases = obtenerClasesCard(reserva.estado);

                    return (
                        <div className="col-sm-12 col-md-6 col-lg-4" key={index}>
                            <div className={clases.card} style={{ maxWidth: '18rem' }}>
                                <div className={clases.header}>
                                    Turno {reserva.Servicio.Especialidad.nombre}
                                </div>
                                <div className="card-body text-success">
                                    <ul className="list-group list-group-flush">
                                        <li className="list-group-item"><strong>Estilista:</strong> {reserva.Admin.nombre}</li>
                                        <li className="list-group-item"><strong>Fecha:</strong> {formatearFecha(reserva.fecha)}</li>
                                        <li className="list-group-item"><strong>Hora de Inicio:</strong> {reserva.horaInicio}</li>
                                        <li className="list-group-item"><strong>Importe de la seña:</strong> {reserva.montoSenia}</li>
                                        <li className="list-group-item"><strong>Importe Total:</strong> ${reserva.montoTotal}</li>
                                        <li className="list-group-item"><strong>Servicio:</strong> {reserva.Servicio.nombre}</li>
                                        <li className="list-group-item"><strong>Especialidad del Servicio:</strong> {reserva.Servicio.Especialidad.nombre}</li>
                                    </ul>
                                </div>
                                <div className={clases.footer}>{reserva.estado}</div>
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };


    const navigate = useNavigate()
    const handleRedirect = () => {

        navigate('/inicio')
    }


    const dividirReservas = (reservas) => {
        const fechaActual = new Date();

        const reservasPasadas = reservas.filter(reserva => new Date(reserva.fecha) < fechaActual);
        const reservasFuturas = reservas.filter(reserva => new Date(reserva.fecha) >= fechaActual);

        return { reservasPasadas, reservasFuturas };
    };
    const { reservasPasadas, reservasFuturas } = dividirReservas(reservas)


    return (
        <div className='body-ctn'>
            <div>
                <div>
                    <button className='btn btn-secondary misTurnos-btn' onClick={handleRedirect}>
                        <i className='bi bi-arrow-left pe-2'></i>
                        Volver</button>
                </div>
                <div className='container-fluid Reservas'>

                    <h4>Tus Turnos</h4>
                    {reservasFuturas.length > 0 ? renderFilasReservas(reservasFuturas) : <tr><td colSpan="5">No tienes turnos</td></tr>}
                    <h4>Tus Turnos Anteriores</h4>
                    {reservasPasadas.length > 0 ? renderFilasReservas(reservasPasadas) : <tr><td colSpan="5">No tienes turnos pasados</td></tr>}
                </div>

            </div>
        </div>


    );

}

export default Historial_turnos