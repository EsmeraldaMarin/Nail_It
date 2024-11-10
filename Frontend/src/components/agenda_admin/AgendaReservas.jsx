import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import axios from 'axios';
import './AgendaReservas.scss';

const AgendaReservas = () => {
    const [reservas, setReservas] = useState([]);
    const [modalReserva, setModalReserva] = useState(null);  // Para manejar la reserva seleccionada
    const userId = localStorage.getItem('userId');

    useEffect(() => {
        axios.get('http://localhost:5050/reserva') // Cambia la URL según tu backend
            .then(response => {
                let eventos = response.data.filter(res => res.id_profesional == userId && res.estado == "confirmada");
                eventos = eventos.map(reserva => {
                    const start = `${reserva.fecha.split('T')[0]}T${reserva.horaInicio}`;
                    const [hour, minute] = reserva.horaInicio.split(':');
                    const end = new Date(reserva.fecha);
                    end.setHours(parseInt(hour) + 1); // Ajusta a una hora más
                    end.setMinutes(parseInt(minute));

                    return {
                        title: `${reserva.Servicio.nombre} - Cliente: ${reserva.Cliente.nombre}`,
                        start: start,
                        end: end.toISOString(),
                        extendedProps: {
                            comprobante: reserva.comprobante,
                            montoSenia: reserva.montoSenia,
                            montoTotal: reserva.montoTotal,
                            estado: reserva.estado,
                            cliente: reserva.Cliente.nombre + " " + reserva.Cliente.apellido,
                            servicio: reserva.Servicio.nombre,
                            especialidad: reserva.Servicio.Especialidad.nombre
                        }
                    };
                });
                setReservas(eventos);
            })
            .catch(error => {
                console.error("Error al cargar reservas:", error);
            });
    }, []);

    // Maneja el clic en un evento del calendario
    const handleEventClick = (info) => {
        setModalReserva(info.event.extendedProps); // Guarda la información en el estado
    };

    return (
        <div className="agenda-section">
            <h3>Mi agenda de reservas</h3>
            <div className="agenda-ctn">
                <FullCalendar
                    plugins={[dayGridPlugin, timeGridPlugin]}
                    initialView="timeGridWeek"
                    events={reservas}
                    headerToolbar={{
                        left: 'prev,next today',
                        center: 'title',
                        right: 'dayGridMonth,timeGridWeek,timeGridDay'
                    }}
                    eventClick={handleEventClick} // Evento al hacer click en un evento
                />
            </div>

            {/* Fondo oscuro cuando se abre el modal */}
            {modalReserva && <div className="overlay" />}

            {/* Modal de detalle de la reserva */}
            {modalReserva && (
                <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog" style={{ marginTop: "150px" }} role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">Detalles de la Reserva</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={() => setModalReserva(null)}>
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <h5>Cliente: {modalReserva.cliente}</h5>
                                <p><strong>Servicio:</strong> {modalReserva.servicio}</p>
                                <p><strong>Especialidad:</strong>{modalReserva.especialidad}</p>
                                <p><strong>Importe seña:</strong> ${modalReserva.montoSenia}</p>
                                <p><strong>Importe Total:</strong> ${modalReserva.montoTotal}</p>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setModalReserva(null)}>Cerrar</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AgendaReservas;
