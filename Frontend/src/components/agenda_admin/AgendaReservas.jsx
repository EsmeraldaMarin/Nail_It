import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import esLocale from '@fullcalendar/core/locales/es';

import axios from 'axios';
import './AgendaReservas.scss';

const AgendaReservas = () => {
    const [reservas, setReservas] = useState([]);
    const [modalReserva, setModalReserva] = useState(null);
    const userId = localStorage.getItem('userId');

    useEffect(() => {
        axios
            .get('http://localhost:5050/reserva') // Cambia la URL según tu backend
            .then((response) => {
                const eventos = response.data
                    .filter((res) => res.id_profesional == userId && res.estado === "confirmada")
                    .map((reserva) => {
                        const fechaBase = new Date(new Date(new Date(reserva.fecha).getTime() + new Date().getTimezoneOffset() * 60000)); // Fecha base
                        const [hour, minute] = reserva.horaInicio.split(':');
                        const start = new Date(fechaBase)
                        start.setHours(parseInt(hour, 10));
                        start.setMinutes(parseInt(minute, 10));

                        const end = new Date(start)
                        end.setMinutes(start.getMinutes() + reserva.Servicio.duracion);

                        return {
                            title: `${reserva.Servicio.nombre} - Cliente: ${reserva.Cliente ? reserva.Cliente.nombre : reserva.nombre_cliente
                                }`,
                            start: start.toISOString(), // Formato ISO
                            end: end.toISOString(),
                            extendedProps: {
                                comprobante: reserva.comprobante,
                                montoSenia: reserva.montoSenia,
                                montoTotal: reserva.montoTotal,
                                duracion: reserva.Servicio.duracion,
                                horaInicio: reserva.horaInicio,
                                horaFin: end.getHours() + ":" + end.getMinutes(), 
                                estado: reserva.estado,
                                cliente: reserva.Cliente
                                    ? `${reserva.Cliente.nombre} ${reserva.Cliente.apellido}`
                                    : `${reserva.nombre_cliente} ${reserva.apellido_cliente}`,
                                numero: reserva.Cliente
                                    ? `${reserva.Cliente.numero}`
                                    : `${reserva.telefono_cliente}`,
                                servicio: reserva.Servicio.nombre,
                                especialidad: reserva.Servicio.Especialidad.nombre,
                            },
                        };
                    });
                setReservas(eventos);
            })
            .catch((error) => {
                console.error("Error al cargar reservas:", error);
            });
    }, [userId]);

    const handleEventClick = (info) => {
        setModalReserva(info.event.extendedProps);
    };

    return (
        <div className="agenda-section">
            {/*<h3>Mi agenda de reservas</h3>*/}
            <div className="agenda-ctn">
                <FullCalendar
                    plugins={[dayGridPlugin, timeGridPlugin]}
                    initialView="dayGridMonth"
                    events={reservas}
                    headerToolbar={{
                        left: 'prev,next today',
                        center: 'title',
                        right: 'dayGridMonth,timeGridWeek,timeGridDay',
                    }}
                    eventClick={handleEventClick}
                    locale={esLocale}
                    height={650}
                />
            </div>

            {modalReserva && <div className="overlay" />}

            {modalReserva && (
                <div
                    className="modal fade show"
                    style={{ display: 'block' }}
                    tabIndex="-1"
                    role="dialog"
                    aria-labelledby="exampleModalLabel"
                    aria-hidden="true"
                >
                    <div className="modal-dialog" style={{ marginTop: '150px' }} role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title fs-3" id="exampleModalLabel">
                                    Detalles de la Reserva
                                </h5>
                                <button
                                    type="button"
                                    className="close"
                                    data-dismiss="modal"
                                    aria-label="Close"
                                    onClick={() => setModalReserva(null)}
                                >
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body fs-5">
                                <h5 className='mb-3 fs-4'><strong>Cliente:</strong> {modalReserva.cliente}</h5>
                                <hr />
                                <p>
                                    <strong>Hora Inicio:</strong> {modalReserva.horaInicio}
                                    <strong> - Hora Fin:</strong> {modalReserva.horaFin} 
                                </p>
                                <p>
                                    <strong>Servicio:</strong> {modalReserva.servicio}
                                </p>
                                <p>
                                    <strong>Especialidad:</strong> {modalReserva.especialidad}
                                </p>
                                <p>
                                    <strong>Importe seña:</strong> ${modalReserva.montoSenia}
                                </p>
                                <p>
                                    <strong>Importe Total:</strong> ${modalReserva.montoTotal}
                                </p>
                                <p>
                                    <strong>Teléfono:</strong> {modalReserva.numero}
                                </p>
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => setModalReserva(null)}
                                >
                                    Cerrar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AgendaReservas;
