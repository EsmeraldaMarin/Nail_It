import "../reserva_admin/Reservas.scss"
import React, { useState, useEffect } from 'react';
import axios from '../../axiosConfig/axiosConfig';
import './Consulta.scss'

export default function ConsultaServicios({ servicios, onNewClick, onActualizar, onEliminar }) {
    const formatPrice = (price) => {
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS',
        }).format(price);
    };
    const tbody = servicios.map((servicio) => (
        <tr key={servicio.id}>
            <td>{servicio.nombre}</td>
            <td>{formatPrice(servicio.precio)}</td>
            <td>{servicio.duracion} minutos</td>
            <td>{servicio.Especialidad.nombre}</td>
            <td style={{maxWidth:"180px"}} >
                <button className="btn btn-sm btn-primary" onClick={() => { onActualizar(servicio) }}>
                    Actualizar
                </button>
                <button className="btn btn-sm btn-danger" style={{marginLeft:"30px"}}  onClick={() => { onEliminar(servicio) }}>
                    Eliminar
                </button>
            </td>
        </tr>
    ));

    return (
        <div className='container-fluid Reservas'>
            <div className="d-flex justify-content-between align-items-center ss">
                <h3>Gestor de Servicios</h3>
                <button type="button" className="btn active fs-5" onClick={onNewClick}>
                    Registrar servicio<i className="bi bi-plus-circle"></i>
                </button>
            </div>

            {/* Reservas del estilista */}
            <div className="table-ctn mis-reservas p-2">
                <div className="  cc" style={{ overflowX: "auto" }}>
                    <table className="table">
                        <thead style={{ position: "sticky", top: "0", boxShadow: "0 0 5px 0 #bbb" }}>
                            <tr>
                                <th scope="col">Servicio</th>
                                <th scope="col">Precio</th>
                                <th scope="col">Duración</th>
                                <th scope="col">Especialidad</th>
                                <th scope="col">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tbody}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}


