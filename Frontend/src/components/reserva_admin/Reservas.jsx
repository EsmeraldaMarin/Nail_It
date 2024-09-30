import "./Reservas.scss"
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Reservas = () => {
    const [reservas, setReservas] = useState([]);

    // Simulando traer datos de la base de datos
    useEffect(() => {
        const fetchReservas = async () => {
            try {
                const response = await axios.get('/api/reservas');
                setReservas(response.data);
            } catch (error) {
                console.error('Error al obtener las reservas', error);
            }
        };
        fetchReservas();
    }, []);

    const handleConfirmarReserva = async (id) => {
        try {
            await axios.post('/api/confirmar-reserva', { id });
            alert('Reserva confirmada exitosamente.');

            // Actualiza el estado local para reflejar el cambio (ej. cambia la reserva a confirmada)
            setReservas((prevReservas) =>
                prevReservas.map((reserva) =>
                    reserva.id === id ? { ...reserva, confirmada: true } : reserva
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
                <table class="table">
                    <thead>
                        <tr>
                            <th scope="col">Nombre</th>
                            <th scope="col">Numero</th>
                            <th scope="col">Fecha y Hora Turno</th>
                            <th scope="col">Monto</th>
                            <th scope="col">Comprobante</th>
                            <th scope="col">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reservas.map(reserva =>

                            <tr>
                                <td>{reserva.nombre}</td>
                                <td>{reserva.numero}</td>
                                <td>{reserva.fecha} / {reserva.hora}</td>
                                <td>${reserva.monto}</td>
                                <td><a href={reserva.comprobante} target="_blank" rel="noreferrer">
                                    Ver Comprobante
                                </a></td>
                                <td> {reserva.confirmada ? (
                                    <span>Confirmada</span>
                                ) : (
                                    <button onClick={() => handleConfirmarReserva(reserva.id)}>
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