import "./Reservas.scss"
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import React, { useState, useEffect } from 'react';
import axios from '../../axiosConfig/axiosConfig';
import ReservasAReembolzar from "./ReservasAReembolzar";
import VisualizadorComprobante from "./VisualizadorComprobante"

const ReservasPendientes = () => {
    const [reservas, setReservas] = useState([]);
    const [botonConfirmacion, setBotonConfirmacion] = useState(null);
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

    const handleClickConfirmar = (id) => {
        setBotonConfirmacion(id)
    }

    const handleConfirmarReserva = async (id) => {
        try {
            const response = await axios.post(`/reserva/confirmar/${id}`, {
                estado: "confirmada"
            });;
            setReservas((prevReservas) =>
                prevReservas.map((reserva) =>
                    reserva.id === id ? { ...reserva, estado: "confirmada" } : reserva
                )
            );
        } catch (error) {
            console.error('Error al confirmar la reserva', error);
        }
        setBotonConfirmacion(null);
    };


    // Filtrar reservas por estilista
    const reservasEstilista = reservas.filter(
        reserva => reserva.estado === "pendiente" && reserva.id_profesional === userId
    );
    //reembolzo 
    const handleReembolzoReserva = async (id, reservaData) => {

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


    return (
        <div className='container-fluid Reservas'>
            <h3>Gestor de reservas a confirmar</h3>
            <h4 className="py-3">Reservas pendientes de comprobar su cobro</h4>

            <div className="table-ctn pb-2 reservas-pendientes" >
                <div className="table-responsive">
                    <table className="table">
                        <thead className="table-light">
                            <tr>
                                <th scope="col">Nombre</th>
                                <th scope="col">Teléfono</th>
                                <th scope="col">Fecha Turno</th>
                                <th scope="col">Hora Turno</th>
                                <th scope="col">Servicio</th>
                                <th scope="col">Importe abonado</th>
                                <th scope="col">Comprobante</th>
                                <th scope="col">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reservasEstilista.map((reserva, index) =>

                                <tr key={index}>
                                    <td className="text-capitalize text-wrap" style={{ width: "8rem" }}>{reserva.Cliente.nombre} {reserva.Cliente.apellido}</td>
                                    <td>{reserva.Cliente.numero}</td>
                                    <td className="text-capitalize">{formatearFecha(reserva.fecha)}</td>
                                    <td>{reserva.horaInicio}</td>
                                    <td className="text-wrap" style={{ width: "10rem" }}>{reserva.Servicio.nombre}</td>
                                    <td><strong>{reserva.montoSenia}</strong></td>
                                    <td><VisualizadorComprobante comprobanteURL={"https://imgv2-1-f.scribdassets.com/img/document/628368179/original/d929c33054/1729712028?v=1"} /></td>
                                    <td>
                                        {botonConfirmacion === reserva.id ? (
                                            <div>
                                                <button className="btn btn-success" onClick={() => handleConfirmarReserva(reserva.id)}>
                                                    Confirmar
                                                </button>
                                                <button className="btn btn-light ms-2" onClick={() => setBotonConfirmacion(null)}>
                                                    <i className="bi bi-x-lg"></i>
                                                </button>
                                            </div>
                                        ) : (
                                            <>
                                                <button className="btn-confirmacion me-2" onClick={() => handleClickConfirmar(reserva.id)}>
                                                    <i className="bi bi-check"></i>
                                                </button>
                                                <button className="btn-cancelacion" onClick={() => handleClickConfirmar(reserva.id)}>
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
            <ReservasAReembolzar reservas={reservas} handleReembolzoReserva={handleReembolzoReserva} formatearFecha={formatearFecha}></ReservasAReembolzar>
        </div>



    );
};

export default ReservasPendientes;