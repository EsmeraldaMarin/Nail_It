import "./Reservas.scss"
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import React, { useState, useEffect } from 'react';
import axios from '../../axiosConfig/axiosConfig';

const ReservasPendientes = () => {
    const [reservas, setReservas] = useState([]);

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
            <h4 className="py-3">Reservas pendientes de Comprobar el Pago</h4>

            <div className="table-ctn table-responsive reservas-pendientes" >
                <table className="table">
                    <thead className="table-light">
                        <tr>
                            <th scope="col">Nombre</th>
                            <th scope="col">Teléfono</th>
                            <th scope="col">Fecha Turno</th>
                            <th scope="col">Hora Turno</th>
                            <th scope="col">Seña</th>
                            <th scope="col">Importe abonado</th>
                            <th scope="col">Comprobante</th>
                            <th scope="col">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reservas.map((reserva, index) =>
                            reserva.estado == "pendiente" &&
                            <tr key={index}>
                                <td className="text-capitalize">{reserva.Cliente.nombre} {reserva.Cliente.apellido}</td>
                                <td>{reserva.Cliente.numero}</td>
                                <td className="text-capitalize">{formatearFecha(reserva.fecha)}</td>
                                <td>{reserva.horaInicio}</td>
                                <td><strong>${reserva.montoSenia}</strong></td>
                                <td><strong>$hacer</strong></td>
                                <td><a href={reserva.comprobante} target="_blank" rel="noreferrer">
                                    Ver Comprobante
                                </a></td>
                                <td>
                                    <button className="btn-confirmacion" onClick={() => handleConfirmarReserva(reserva.id)}>
                                        Confirmar
                                    </button>
                                </td>
                            </tr>
                        )}


                    </tbody>
                </table>
            </div>
        </div>



    );
};

export default ReservasPendientes;