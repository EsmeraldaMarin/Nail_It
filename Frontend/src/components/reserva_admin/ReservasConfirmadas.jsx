import "./Reservas.scss"
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import React, { useState, useEffect } from 'react';
import axios from '../../axiosConfig/axiosConfig';

const ReservasConfirmadas = () => {
    const [reservas, setReservas] = useState([]);
    const [reservasPorEstilista, setReservasPorEstilista] = useState([]);

    const formatearFecha = (fecha) => {
        return format(new Date(fecha), 'EEEE dd/MM', { locale: es });
    };

    useEffect(() => {
        const fetchReservas = async () => {
            try {
                //ver de traer las reservas confirmadas desde el back
                const response = await axios.get('/reserva');
                //const responsePorEstilista = await axios.get('/reserva/estilista=?') como obtengo el id de la estilista? token de inicio de sesion?
                setReservas(response.data);
                //modificar esto de abajo luego de hacer bien el request by estilista
                setReservasPorEstilista(response.data)

            } catch (error) {
                console.error('Error al obtener las reservas', error);
            }
        };
        fetchReservas();
    }, []);



    return (
        <div className='container-fluid Reservas'>
            <h3>Gestor de Reservas</h3>
            <h4>Tus reservas</h4>
            <div className="table-ctn" style={{ overflowX: "auto" }}>
                <table className="table">
                    <thead>
                        <tr>
                            <th scope="col">Nombre</th>
                            <th scope="col">Numero</th>
                            <th scope="col">Fecha Turno</th>
                            <th scope="col">Hora Turno</th>
                            <th scope="col">Monto</th>
                            {/* <th scope="col">Acciones</th> */}
                        </tr>
                    </thead>
                    <tbody>
                        {reservas.map(reserva =>

                            reserva.estado == "confirmada" &&
                            <tr>
                                <td>{reserva.cliente}</td>
                                <td>{reserva.numero}3333355555</td>
                                <td>{formatearFecha(reserva.fecha)}</td>
                                <td>{reserva.horaInicio}</td>
                                <td>${reserva.montoSenia}</td>

                                {/* <td> {reserva.estado == "confirmada" ? (
                                    <span className="confirmada">Confirmada</span>
                                ) : (
                                    <button className="btn-confirmacion" onClick={() => handleConfirmarReserva(reserva.id)}>
                                        Confirmar
                                    </button>
                                )}</td> */}
                            </tr>

                        )}


                    </tbody>
                </table>
            </div>
            <h4>Reservas de hoy</h4>

            <div className="table-ctn" style={{ overflowX: "auto" }}>
                <table className="table">
                    <thead>
                        <tr>
                            <th scope="col">Estilista</th>
                            <th scope="col">Nombre</th>
                            <th scope="col">Numero</th>
                            <th scope="col">Fecha Turno</th>
                            <th scope="col">Hora Turno</th>
                            <th scope="col">Monto</th>
                            {/* <th scope="col">Acciones</th> */}
                        </tr>
                    </thead>
                    <tbody>
                        {reservas.map(reserva =>

                            reserva.estado == "confirmada" &&
                            <tr>
                                <td>Aca va el nombre de la estilista</td>
                                <td>{reserva.cliente}</td>
                                <td>{reserva.numero}3333355555</td>
                                <td>{formatearFecha(reserva.fecha)}</td>
                                <td>{reserva.horaInicio}</td>
                                <td>${reserva.montoSenia}</td>
                                {/* <td> {reserva.estado == "confirmada" ? (
                                    <span className="confirmada">Confirmada</span>
                                ) : (
                                    <button className="btn-confirmacion" onClick={() => handleConfirmarReserva(reserva.id)}>
                                        Confirmar
                                    </button>
                                )}</td> */}
                            </tr>

                        )}


                    </tbody>
                </table>
            </div>
        </div>



    );
};

export default ReservasConfirmadas;