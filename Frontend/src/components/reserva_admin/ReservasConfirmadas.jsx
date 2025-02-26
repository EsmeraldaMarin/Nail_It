import React, { useState, useEffect } from 'react';
import axios from '../../axiosConfig/axiosConfig';
import ReservaDeEstilista from "./ReservaDeEstilista";
import "./Reservas.scss";
import { format, isSameDay } from 'date-fns';
import { es } from 'date-fns/locale';

const ReservasConfirmadas = () => {
    const [reservas, setReservas] = useState([]);
    const [modal, setModal] = useState({ show: false, action: null, id: null });
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

    useEffect(() => {
        const fetchReservas = async () => {
            try {
                // Este GET esta devolviendo todas las reservas existentes cuando solo estas usando las de hoy en el front
                // Agregar filtro de fecha para prevenir una respuesta muy grande y demoras en la carga.
                const tzoffset = (new Date()).getTimezoneOffset() * 60000;
                const localISODate = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1);
                // const currentDate = "2025-02-02";
                const currentDate = (localISODate).split('T')[0];

                const response = await axios.get('/reserva?fecha=' + currentDate);
                const reservasQueCumplenEstado = response.data.filter(reserva => ["confirmada", "realizada", "no_realizada"].includes(reserva.estado))
                setReservas(reservasQueCumplenEstado);
            } catch (error) {
                console.error('Error al obtener las reservas', error);
            }
        };
        fetchReservas();
    }, []);

    const hoy = new Date();

    // Se agrega columna en la tabla para poder mostrar el estado
    // Se desactiva el filtro de isSameDay ya que el back va devolver esa informacion ya filtrada
    const reservasEstilista = reservas.filter(
        reserva => reserva.id_profesional === userId // &&
        // isSameDay(new Date(new Date(reserva.fecha).getTime() + new Date().getTimezoneOffset() * 60000), hoy)
    ).sort((a, b) => {
        const estadosFinales = ["realizada", "no_realizada"];

        // Si "a" es una reserva finalizada y "b" no, mover "a" al final (retorna 1)
        if (estadosFinales.includes(a.estado) && !estadosFinales.includes(b.estado)) {
            return 1;
        }

        // Si "b" es una reserva finalizada y "a" no, mover "b" al final (retorna -1)
        if (!estadosFinales.includes(a.estado) && estadosFinales.includes(b.estado)) {
            return -1;
        }

        // Si ambos tienen el mismo estado, mantener el orden
        return 0;
    });

    const handleAction = async () => {
        const { action, id } = modal;
        try {
            const response = await axios.post(`/reserva/finalizar/${id}`, {
                estado: action === "llegada" ? "realizada" : "no_realizada"
            });
            setReservas((prevReservas) =>
                prevReservas.map((reserva) =>
                    reserva.id === id
                        ? { ...reserva, estado: action === "llegada" ? "realizada" : "no_realizada" }
                        : reserva
                )
            );
        } catch (error) {
            console.error(`Error al actualizar la reserva: ${error}`);
        } finally {
            setModal({ show: false, action: null, id: null });
        }
    };
    const getBadgeClassByStatus = (status) => {
        let badgeClass = "badge rounded-pill ";

        if (status == "realizada") {
            badgeClass += "text-success border border-success";
        }
        else if (status == "cancelada") {
            badgeClass += "text-danger border border-danger";
        }
        else if (status == "no_realizada") {
            badgeClass += "text-danger border border-danger";
        }
        else {
            badgeClass += "text-primary border border-primary";
        }

        return badgeClass;
    }

    const reservaEstadoName = {
        realizada: "Realizada",
        cancelada: "Cancelada",
        no_realizada: "No realizada",
        pendiente: "Pendiente",
        por_reembolzar: "Por reembolzar",
        confirmada: "Confirmada",
        // TODO: agregar todos los estados posibles
    };

    const renderFilasReserva = (reservasFiltradas) => {
        return reservasFiltradas.map((reserva, index) => (
            <tr key={index} className={["realizada", "no_realizada"].includes(reserva.estado) ? "table-active realizadas" : ""}>
                <td className="text-capitalize text-wrap" style={{ minWidth: "170px", maxWidth: "170px" }}>{reserva.Servicio.nombre}</td>
                <td className="text-capitalize text-wrap" style={{ minWidth: "170px", maxWidth: "170px" }}>
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
                <td className="text-capitalize">{formatearFecha(reserva.fecha)}</td>
                <td>{reserva.horaInicio}</td>
                <td className='text-end'>{formatPrice(reserva.montoTotal)}</td>
                <td className='text-end'>{formatPrice(reserva.montoSenia)}</td>
                <td className="fs-5 text-end"><strong>{formatPrice(reserva.montoTotal - convertirAFloat(reserva.montoSenia))}</strong></td>
                <td className='text-end'>
                    <span className={"badge rounded-pill " + getBadgeClassByStatus(reserva.estado)}>
                        {reservaEstadoName[reserva.estado]}
                    </span>
                </td>
                <td>
                    <button
                        type="button"
                        className="me-1 btn btn-primary"
                        onClick={() => setModal({ show: true, action: "llegada", id: reserva.id })}
                    >
                        Llegó
                    </button>
                    <button
                        type="button"
                        className="me-1 btn btn-danger"
                        onClick={() => setModal({ show: true, action: "no_llegada", id: reserva.id })}
                    >
                        No llegó
                    </button>
                </td>
            </tr>
        ));
    };
    const formatPrice = (price) => {
        if (typeof price === "string") {
            price = parseFloat(price.replace(",", "."));
        }
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS',
            minimumFractionDigits: 2, // Asegura que se muestren dos decimales
            maximumFractionDigits: 2,
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
                            <th scope="col" style={{ minWidth: "170px", maxWidth: "170px" }}>Servicio</th>
                            <th scope="col" style={{ minWidth: "170px", maxWidth: "170px" }}>Cliente</th>
                            <th scope="col">Teléfono</th>
                            <th scope="col">Fecha Turno</th>
                            <th scope="col">Hora Turno</th>
                            <th scope="col" className='text-end'>Precio servicio</th>
                            <th scope="col" className='text-end'>Importe abonado</th>
                            <th scope="col" className='text-end'>Importe a cobrar</th>
                            <th scope="col" className='text-end'>Estado</th>
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
                        {reservas.length > 0
                            ? reservas.map((reserva, index) => (
                                <tr key={index}>
                                    <th className="text-uppercase" style={{ backgroundColor: "#eee" }}>{reserva.Admin.nombre}</th>
                                    <td style={{ width: "20rem" }}>{reserva.Servicio.nombre}</td>
                                    <td className="text-capitalize">{reserva.Cliente ? reserva.Cliente.nombre + " " + reserva.Cliente.apellido : reserva.nombre_cliente + " " + reserva.apellido_cliente}</td>
                                    <td>{reserva.Cliente ? reserva.Cliente.numero : reserva.telefono_cliente}</td>
                                    <td className="text-capitalize">{formatearFecha(reserva.fecha)}</td>
                                    <td>{reserva.horaInicio}</td>
                                </tr>
                            ))
                            : <tr><td colSpan="6">No hay reservas confirmadas para hoy</td></tr>}
                    </tbody>
                </table>
            </div>

            {/* Modal de confirmación */}
            {modal.show && (
                <div className="modal show d-block" style={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }}>
                    <div className="modal-dialog" style={{ marginTop: "25vh" }}>
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title fs-4">Confirmación</h5>
                                <button type="button" className="btn-close" onClick={() => setModal({ show: false, action: null, id: null })}></button>
                            </div>
                            <div className="modal-body fs-4">
                                <p>¿Estás seguro de que quieres marcar esta acción como <strong className={modal.action === "llegada" ? "text-success" : "text-danger"}>"{modal.action === "llegada" ? "Llegó" : "No llegó"}"</strong>?</p>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setModal({ show: false, action: null, id: null })}>Cancelar</button>
                                <button type="button" className="btn btn-primary" onClick={handleAction}>Confirmar</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReservasConfirmadas;
