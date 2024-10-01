import "./Reservas.scss"
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import React, { useState, useEffect } from 'react';
import axios from '../../axiosConfig/axiosConfig';

const Reservas = () => {
    const [reservas, setReservas] = useState([]);

    const formatearFecha = (fecha) => {
        return format(new Date(fecha), 'EEEE dd/MM', { locale: es });
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
    };

    return (
        <div className='container-fluid Reservas'>
            <h3>Gestor de Reservas</h3>
            <h4>Reservas pendientes de Comprobar el Pago</h4>

            <div className="table-ctn" style={{ overflowX: "auto" }}>
                <table className="table">
                    <thead>
                        <tr>
                            <th scope="col">Nombre</th>
                            <th scope="col">Numero</th>
                            <th scope="col">Fecha Turno</th>
                            <th scope="col">Hora Turno</th>
                            <th scope="col">Monto</th>
                            <th scope="col">Comprobante</th>
                            <th scope="col">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reservas.map(reserva =>

                            <tr>
                                <td>{reserva.cliente}</td>
                                <td>{reserva.numero}3333355555</td>
                                <td>{formatearFecha(reserva.fecha)}</td>
                                <td>{reserva.horaInicio}</td>
                                <td>${reserva.montoSenia}</td>
                                <td><a href={reserva.comprobante} target="_blank" rel="noreferrer">
                                    Ver Comprobante
                                </a></td>
                                <td> {reserva.estado == "confirmada" ? (
                                    <span className="confirmada">Confirmada</span>
                                ) : (
                                    <button className="btn-confirmacion" onClick={() => handleConfirmarReserva(reserva.id)}>
                                        Confirmar
                                    </button>
                                )}</td>
                            </tr>

                        )}


                    </tbody>
                </table>
            </div>
        </div>



    );
};

export default Reservas;