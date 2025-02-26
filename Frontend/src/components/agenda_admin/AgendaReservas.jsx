import React, { useEffect, useState } from 'react';
import axios from '../../axiosConfig/axiosConfig'
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import esLocale from '@fullcalendar/core/locales/es';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import './AgendaReservas.scss';
import ModalEnviarMensaje from '../reserva_admin/subComponentes/ModalEnviarMensaje';
import ListadoAgendaReservas from './ListadoAgendaReservas';

const AgendaReservas = () => {
    const [reservas, setReservas] = useState([]);
    const [reservasParaListado, setReservasParaListado] = useState([]);
    const [modalReserva, setModalReserva] = useState(null);

    // Necesario para enviar por wpp notificacion a cliente---------------
    const [telefonoCliente, setTelefonoCliente] = useState("")
    const [mensajeACliente, setMensajeACliente] = useState("")
    const [showModal, setShowModal] = useState(false);

    const userId = localStorage.getItem('userId');

    const formatearFecha = (fecha) => {
        const fechaLocal = new Date(new Date(fecha).getTime() + new Date().getTimezoneOffset() * 60000);
        return format(fechaLocal, 'EEEE dd/MM', { locale: es });
    };


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
                                id: reserva.id,
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
                setReservasParaListado(response.data.filter((res) => res.id_profesional == userId && res.estado === "confirmada"))
            })
            .catch((error) => {
                console.error("Error al cargar reservas:", error);
            });
    }, [userId]);

    const handleEventClick = (info) => {
        setModalReserva(info.event.extendedProps);
    };

    const handleCancelarReserva = async (id) => {
        const response = await axios.post(`/reserva/por_reembolsar/${id}`, {
            estado: "por_reembolsar"
        });;
        setMensajeACliente(`*Hola, ${response.data.Cliente ? response.data.Cliente.nombre : response.data.nombre_cliente}!*\n\n` +
            `Tu reserva a una sesión de *${response.data.Servicio.nombre}* el *${formatearFecha(response.data.fecha)}* a las *${response.data.horaInicio}hs* ha sido *cancelada*.\n` +
            `Tu seña será devuelta, por favor confirma tu alias o CBU y el nombre del titular de la cuenta.\n\n` +
            `Muchas Gracias!,\n\n` +
            `- _Oh My Nails_`
        )
        setTelefonoCliente(response.data.Cliente ? response.data.Cliente.numero : response.data.telefono_cliente);

        // actualiza la lista de reservas.
        const nuevaLista = await axios.get('http://localhost:5050/reserva');
        const eventosActualizados = nuevaLista.data
            .filter((res) => res.id_profesional == userId && res.estado === "confirmada")
            .map((reserva) => ({
                title: `${reserva.Servicio.nombre} - Cliente: ${reserva.Cliente ? reserva.Cliente.nombre : reserva.nombre_cliente}`,
                start: new Date(reserva.fecha).toISOString(),
                extendedProps: { id: reserva.id, estado: reserva.estado }
            }));
        setReservas(eventosActualizados);
        setReservasParaListado(nuevaLista.data.filter((res) => res.id_profesional == userId && res.estado === "confirmada"));
        setModalReserva(null);
        setShowModal(true);
    }

    const handleEnviarMensaje = () => {
        const mensajeEncoded = encodeURIComponent(mensajeACliente);
        const url = `https://wa.me/${telefonoCliente}?text=${mensajeEncoded}`;

        window.open(url, '_blank'); // Abrir WhatsApp en una nueva pestaña
        setShowModal(false); // Cerrar el modal después de enviar
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
                            <div className="modal-footer d-flex justify-content-between">
                                <button
                                    type="button"
                                    className="btn btn-danger"
                                    onClick={() => handleCancelarReserva(modalReserva.id)}
                                >
                                    Cancelar Reserva
                                </button>
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

            <ListadoAgendaReservas reservas={reservasParaListado} handleCancelarReserva={handleCancelarReserva}></ListadoAgendaReservas>

            <ModalEnviarMensaje
                showModal={showModal}
                handleClose={() => setShowModal(false)}
                mensaje={mensajeACliente}
                telefono={telefonoCliente}
                onEnviar={handleEnviarMensaje}
            />
        </div>
    );
};

export default AgendaReservas;
