import "./Reservas.scss"
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import React, { useState, useEffect } from 'react';
import axios from '../../axiosConfig/axiosConfig';
import ReservasAReembolsar from "./ReservasAReembolsar";
import VisualizadorComprobante from "./subComponentes/VisualizadorComprobante"
import ModalEnviarMensaje from "./subComponentes/ModalEnviarMensaje";

const ReservasPendientes = () => {
    const [reservas, setReservas] = useState([]);
    const [botonConfirmacion, setBotonConfirmacion] = useState(null);
    const [estilosBtn, setEstilosBtn] = useState("confirm");
    const userId = localStorage.getItem('userId');

    // Necesario para enviar por wpp confirmacion a cliente---------------
    const [telefonoCliente, setTelefonoCliente] = useState("")
    const [mensajeACliente, setMensajeACliente] = useState("")
    const [reservaSeleccionada, setReservaSeleccionada] = useState(null);
    const [showModal, setShowModal] = useState(false);
    //-------------------------------------------------

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

    const handleClickConfirmar = (id) => {
        setBotonConfirmacion(id);
        setEstilosBtn("confirm");
    }
    const handleClickCancelar = (id) => {
        setBotonConfirmacion(id);
        setEstilosBtn("cancel");
    }

    const handleConfirmarReserva = async (id) => {
        try {
            if (estilosBtn === "confirm") {
                const response = await axios.post(`/reserva/confirmar/${id}`, {
                    estado: "confirmada"
                });;
                setMensajeACliente(`*Hola, ${response.data.Cliente ? response.data.Cliente.nombre : response.data.nombre_cliente}!*\n\n` +
                    `Tu reserva a una sesión de *${response.data.Servicio.nombre}* ha sido *confirmada* exitosamente.\n` +
                    `Te esperamos en nuestro local el *${formatearFecha(response.data.fecha)}* a las *${response.data.horaInicio}hs*.\n` +
                    `¡Muchas gracias!\n\n` +
                    `- _Oh My Nails_`
                )
                setTelefonoCliente(response.data.Cliente ? response.data.Cliente.numero : response.data.telefono_cliente);
                setReservaSeleccionada(response.data)
                setReservas((prevReservas) =>
                    prevReservas.map((reserva) =>
                        reserva.id === id ? { ...reserva, estado: "confirmada" } : reserva
                    )
                );
                setShowModal(true);
            } else {
                const response = await axios.post(`/reserva/por_reembolsar/${id}`, {
                    estado: "por_reembolsar"
                });;
                setMensajeACliente(`*Hola, ${response.data.Cliente ? response.data.Cliente.nombre : response.data.nombre_cliente}!*\n\n` +
                    `Tu reserva a una sesión de *${response.data.Servicio.nombre}* el *${formatearFecha(response.data.fecha)}* a las *${response.data.horaInicio}hs* ha sido CANCELADA.\n` +
                    `Tu seña será devuelta, por favor confirma tu alias o CBU y el nombre del titular de la cuenta.\n\n` +
                    `Muchas Gracias!,\n\n` +
                    `- _Oh My Nails_`
                )
                setTelefonoCliente(response.data.Cliente ? response.data.Cliente.numero : response.data.telefono_cliente);
                setReservaSeleccionada(response.data)
                setReservas((prevReservas) =>
                    prevReservas.map((reserva) =>
                        reserva.id === id ? { ...reserva, estado: "por_reembolsar" } : reserva
                    )
                );
                setShowModal(true);
            }
           
        } catch (error) {
            console.error('Error al confirmar la reserva', error);
        }
        setBotonConfirmacion(null);
    };
    // Función para enviar el mensaje (por ejemplo, abrir WhatsApp)
    const handleEnviarMensaje = () => {
        const mensajeEncoded = encodeURIComponent(mensajeACliente);
        const url = `https://wa.me/${telefonoCliente}?text=${mensajeEncoded}`;

        window.open(url, '_blank'); // Abrir WhatsApp en una nueva pestaña
        setShowModal(false); // Cerrar el modal después de enviar
    };

    // Filtrar reservas por estilista
    const reservasEstilista = reservas.filter(
        reserva => reserva.estado === "pendiente" && reserva.id_profesional === userId
    );
    //reembolso 
    const handleReembolsoReserva = async (id, reservaData) => {

        const result = await axios.put(`/reserva/${id}`, {
            horaInicio: reservaData.horaInicio,
            comprobante: reservaData.comprobante,
            fecha: reservaData.fecha,
            montoSenia: reservaData.montoSenia,
            montoTotal: reservaData.montoTotal,
            id_servicio: reservaData.id_servicio,
            id_cliente: reservaData.id_cliente,
            id_profesional: reservaData.id_profesional,
            estado: "cancelada"
        });
        if (result) {
            const response = await axios.get('/reserva');
            setReservas(response.data);
        }
    }
    const formatPrice = (price) => {
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS',
        }).format(price);
    };

    return (
        <div className='container-fluid Reservas'>
            <h3>Gestor de reservas a confirmar</h3>
            <h4 className="py-3">Reservas pendientes de comprobar su cobro</h4>

            <div className="table-ctn pb-2 reservas-pendientes" >
                <div className="table-responsive">
                    <table className="table">
                        <thead className="table-light">
                            <tr>
                                <th scope="col">Nombre Cliente</th>
                                <th scope="col">Teléfono</th>
                                <th scope="col">Fecha Turno</th>
                                <th scope="col">Hora Turno</th>
                                <th scope="col">Servicio</th>
                                <th scope="col">Importe abonado</th>
                                {/*<th scope="col">Comprobante</th>*/}
                                <th scope="col">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reservasEstilista.map((reserva, index) =>

                                <tr key={index}>
                                    <td className="text-capitalize text-wrap">{reserva.Cliente ? reserva.Cliente.nombre : reserva.nombre_cliente} {reserva.Cliente ? reserva.Cliente.apellido : reserva.apellido_cliente}</td>
                                    <td><a
                                        href={`https://wa.me/${reserva.Cliente ? reserva.Cliente.numero : reserva.telefono_cliente}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{ color: "#000", textDecoration: "none" }}
                                    >
                                        <i className="bi bi-whatsapp" style={{ color: "green" }}> </i>
                                        {reserva.Cliente ? reserva.Cliente.numero : reserva.telefono_cliente}
                                    </a></td>
                                    <td className="text-capitalize">{formatearFecha(reserva.fecha)}</td>
                                    <td>{reserva.horaInicio}</td>
                                    <td className="text-wrap" style={{ width: "10rem" }}>{reserva.Servicio.nombre}</td>
                                    <td><strong>{formatPrice(reserva.montoSenia)}</strong></td>
                                    {/*<td><VisualizadorComprobante comprobanteURL={"https://imgv2-1-f.scribdassets.com/img/document/628368179/original/d929c33054/1729712028?v=1"} /></td> */}
                                    <td>
                                        {botonConfirmacion === reserva.id ? (
                                            <div>
                                                {/*Este boton CONFIRMA o CANCELA una reserva */}
                                                <button className={estilosBtn == "confirm" ? "btn btn-success" : "btn btn-danger"} onClick={() => handleConfirmarReserva(reserva.id)}>
                                                    {estilosBtn == "confirm" ? "Confirmar" : "Cancelar"}
                                                </button>
                                                {/*Este boton vuelve atras la accion*/}
                                                <button className="btn btn-light ms-2" onClick={() => setBotonConfirmacion(null)}>
                                                    <i className="bi bi-x-lg"></i>
                                                </button>
                                            </div>
                                        ) : (
                                            <>
                                                <button className="btn-confirmacion me-2" onClick={() => handleClickConfirmar(reserva.id)}>
                                                    <i className="bi bi-check"></i>
                                                </button>
                                                <button className="btn-cancelacion" onClick={() => handleClickCancelar(reserva.id)}>
                                                    <i className="bi bi-x"></i>
                                                </button>
                                            </>
                                        )}

                                    </td>
                                </tr>
                            )}


                        </tbody>
                    </table>
                </div>
            </div>
            <ModalEnviarMensaje
                showModal={showModal}
                handleClose={() => setShowModal(false)}
                mensaje={mensajeACliente}
                telefono={telefonoCliente}
                onEnviar={handleEnviarMensaje}
            />
            <ReservasAReembolsar reservas={reservas} handleReembolsoReserva={handleReembolsoReserva} formatearFecha={formatearFecha}></ReservasAReembolsar>
        </div >



    );
};

export default ReservasPendientes;