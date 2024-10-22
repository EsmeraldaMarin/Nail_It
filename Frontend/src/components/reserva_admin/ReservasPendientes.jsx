import "./Reservas.scss"
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import React, { useState, useEffect } from 'react';
import axios from '../../axiosConfig/axiosConfig';
import ReservasAReembolzar from "./ReservasAReembolzar";

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
    console.log(reservaData)
    
    const result = await axios.put(`/reserva/${id}`, {
        horaInicio: reservaData.horaInicio,
        comprobante: reservaData.comprobante,
        fecha: reservaData.fecha,
        montoSenia: reservaData.montoSenia,
        montoTotal: reservaData.montoTotal,
        id_servicio: reservaData.id_servicio,
        id_cliente: reservaData. id_cliente,
        id_profesional: reservaData.id_profesional,
        estado: "cancelada"
    });
    if(result){
        const response = await axios.get('/reserva');
        setReservas(response.data);
    }
}
    

    return (
        <div className='container-fluid Reservas'>
            <h3>Gestor de reservas a confirmar</h3>
            <h4 className="py-3">Reservas pendientes de comprobar su cobro</h4>

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
                        {reservasEstilista.map((reserva, index) =>

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
                                    {botonConfirmacion === reserva.id ? (
                                        <div>
                                            <button className="btn btn-danger" onClick={() => handleConfirmarReserva(reserva.id)}>
                                                Confirmar
                                            </button>
                                            <button className="btn btn-light ms-2" onClick={() => setBotonConfirmacion(null)}>
                                                <i className="bi bi-x-lg"></i>
                                            </button>
                                        </div>
                                    ) : (
                                        <button className="btn-confirmacion" onClick={() => handleClickConfirmar(reserva.id)}>
                                            Confirmar
                                        </button>
                                    )}

                                </td>
                            </tr>
                        )}


                    </tbody>
                </table>
            </div>
            <ReservasAReembolzar reservas = {reservas} handleReembolzoReserva={handleReembolzoReserva} formatearFecha={formatearFecha}></ReservasAReembolzar>
        </div>



    );
};

export default ReservasPendientes;