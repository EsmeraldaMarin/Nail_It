import "../reserva_admin/Reservas.scss"
import React, { useState, useEffect } from 'react';
import axios from '../../axiosConfig/axiosConfig';
import './Consulta.scss'

export default function ConsultaServicios({ servicios, onNewClick, onActualizar }) {
    const tbody = servicios.map((servicio) => (
        <tr key={servicio.id}>
            <td>{servicio.nombre}</td>
            <td>{servicio.precio}</td>
            <td>{servicio.duracion}</td>
            <td>{servicio.Especialidad.nombre}</td>
            <td>
                <button className="btn btn-sm btn-secondary" onClick={() => { onActualizar(servicio) }}>
                    Actualizar
                </button>
            </td>
        </tr>
    ));

    return (
        <div className='container-fluid Reservas'>
            <div className="d-flex justify-content-between align-items-center ss">
                <h3>Gestor de Servicios</h3>
                <button type="button" className="btn active" onClick={onNewClick}>
                    Registrar servicio<i className="bi bi-plus-circle"></i>
                </button>
            </div>

            {/* Reservas del estilista */}
            <div className="table-ctn mis-reservas p-2">
                <div className="  cc" style={{ overflowX: "auto" }}>
                    <table className="table">
                        <thead>
                            <tr>
                                <th scope="col">Servicio</th>
                                <th scope="col">Precio</th>
                                <th scope="col">Duración</th>
                                <th scope="col">Especialidad</th>
                                <th scope="col">Acción</th>
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


