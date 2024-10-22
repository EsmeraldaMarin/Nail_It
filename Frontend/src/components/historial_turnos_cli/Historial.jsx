import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import React, { useState, useEffect } from 'react';
import axios from '../../axiosConfig/axiosConfig';
import { useNavigate } from 'react-router-dom';
import "./Historial.scss"

const Historial_turnos = () => {
    const [reservas, setReservas] = useState([]);
    const userId = localStorage.getItem('userId');
    const [item, setItem] = useState([])

    const formatearFecha = (fecha) => {
        const fechaLocal = new Date(new Date(fecha).getTime() + new Date().getTimezoneOffset() * 60000);
        return format(fechaLocal, 'EEEE dd/MM', { locale: es });
    };

    const calcularDiferenciaHoras = (fechaReserva) => {
        const fechaActual = new Date();
        const diferenciaMilisegundos = new Date(fechaReserva) - fechaActual;
        const diferenciaHoras = diferenciaMilisegundos / (1000 * 60 * 60); // Convertir de milisegundos a horas
        return diferenciaHoras;
    };

    const onActualizar = async (id, reservaData) => {
        console.log(reservaData)
        
        const result = await axios.put(`/reserva/${id}`, {
            horaInicio: reservaData.horaInicio,
            comprobante: reservaData.comprobante,
            fecha: reservaData.fecha,
            montoSenia: reservaData.montoSenia,
            montoTotal: reservaData.montoTotal,
            id_servicio: reservaData.id_servicio,
            id_cliente: reservaData. id_cliente,
            id_profesional: reservaData.id_profesional,
            estado: calcularDiferenciaHoras(reservaData.fecha) >= 48 ? "por_reembolsar" : "cancelada"
        });
        if(result){
            const response = await axios.get(`/reserva/user/${userId}`);
            setReservas(response.data);
            setItem({})
        }
    }

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

    const esCancelable = (reserva) => {
        const fechaActual = new Date();
        const fechaReserva = new Date(reserva.fecha);
        
        // Comparar las fechas
        if (fechaReserva > fechaActual) {
            return true; // La fecha de la reserva es mayor que la fecha actual
        } else if (fechaReserva.toDateString() === fechaActual.toDateString()) {
            // Si es el mismo día, comparar la hora
            const [horaReserva, minutosReserva] = reserva.horaInicio.split(':').map(Number);
            const horaActual = fechaActual.getHours();
            const minutosActuales = fechaActual.getMinutes();
            
            // Verificar si la hora de inicio es mayor que la hora actual
            if (horaReserva > horaActual || (horaReserva === horaActual && minutosReserva > minutosActuales)) {
                return true;
            }
        }
    
        return false; // No es cancelable si la fecha y hora no cumplen con los criterios
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
                                        { 
                                    
                                        (reserva.estado === 'pendiente' || reserva.estado === 'confirmada' ) && esCancelable(reserva) && (
                                            <button className="btn btn-danger btn-sm ms-4"  onClick={() => onActualizar(reserva.id,reserva)} >
                                                Cancelar
                                            </button>
                                        )}
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
                                <div className={clases.footer + " text-uppercase"}> {reserva.estado === 'por_reembolsar' ? 'pendiente de reembolso' : reserva.estado}</div>
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
        const reservasFuturas = reservas.filter(reserva => new Date(reserva.fecha) >= fechaActual).reverse();

        return { reservasPasadas, reservasFuturas };
    };
    const { reservasPasadas, reservasFuturas } = dividirReservas(reservas)


    return (
        <div className='body-ctn'>
            <div>
               
                <div className='container-fluid Reservas'>

                    <h4>Mis Reservas</h4>
                    {reservasFuturas.length > 0 ? renderFilasReservas(reservasFuturas) : <tr><td colSpan="5">No tienes reservas proximas</td></tr>}
                    <h4>Mis Reservas anteriores</h4>
                    {reservasPasadas.length > 0 ? renderFilasReservas(reservasPasadas) : <tr><td colSpan="5">No tienes reservas pasados</td></tr>}
                </div>
                <div>
                    <button className='btn misTurnos-btn' onClick={handleRedirect}>
                        <i className='bi bi-arrow-left pe-2'></i>
                        Volver</button>
                </div>

            </div>
        </div>


    );

}

export default Historial_turnos