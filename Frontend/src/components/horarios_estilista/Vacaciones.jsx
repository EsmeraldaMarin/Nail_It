import React, { useState, useEffect } from "react";
import "./Horarios.scss";
import axios from '../../axiosConfig/axiosConfig';

export default function Vacaciones() {
    const [fechaDesde, setFechaDesde] = useState("");
    const [fechaHasta, setFechaHasta] = useState("");
    const [mensaje, setMensaje] = useState("");
    const [diasLibres, setDiasLibres] = useState([]);

    useEffect(() => {
        const fetchDiasLibres = async () => {
            try {
                const response = await axios.get("/diasLibres");  // Asegúrate de que la ruta sea correcta
                if (response.status === 200) {
                    setDiasLibres(response.data);  // Actualiza el estado con los días libres obtenidos
                }
            } catch (error) {
                console.error("Hubo un error al obtener los días libres.");
                setMensaje("Hubo un error al obtener los días libres.");
            }
        };

        fetchDiasLibres();
    }, []); 

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!fechaDesde || !fechaHasta) {
            setMensaje("Ambas fechas son requeridas.");
            return;
        }

        // Obtener el id_admin desde el localStorage
        const idAdmin = localStorage.getItem('userId');

        if (!idAdmin) {
            setMensaje("No estás autenticado.");
            return;
        }

        try {
            const datos = {
                id_admin: idAdmin,  // Usar el id_admin desde el localStorage
                fecha_desde: fechaDesde,
                fecha_hasta: fechaHasta,
            };

            // Realizar la solicitud POST al backend para guardar los días libres
            const response = await axios.post("/diasLibres", datos);
            
            if (response.status === 201) {
                console.log(datos);
                setMensaje("Días libres guardados correctamente.");
                const fetchData = await axios.get("/diasLibres");
                setDiasLibres(fetchData.data);
            } else {
                setMensaje("Hubo un error al guardar los días libres.");
            }
        } catch (error) {
            setMensaje("Hubo un error al intentar guardar los días libres.");
        }
    };

    const handleDelete = async (id) => {
        try {
            const response = await axios.delete(`/diasLibres/${id}`);  // Asegúrate de que la ruta sea correcta
            if (response.status === 200) {
                setMensaje("Día libre eliminado correctamente.");
                // Actualizar la lista de días libres después de eliminar
                setDiasLibres(diasLibres.filter(dia => dia.id !== id));
            } else {
                setMensaje("Hubo un error al eliminar el día libre.");
            }
        } catch (error) {
            setMensaje("Hubo un error al intentar eliminar el día libre.");
        }
    };

    return (
        <div className="ctn-horarios">
            <h3>Mis días libres</h3>
            <div className="form-horario-atencion">
                <form onSubmit={handleSubmit}>
                    <label>Fecha desde:</label>
                    <input
                        type="date"
                        className="form-control"
                        value={fechaDesde}
                        onChange={(e) => setFechaDesde(e.target.value)}
                        required
                    />
                    <label>Fecha hasta:</label>
                    <input
                        type="date"
                        className="form-control"
                        value={fechaHasta}
                        onChange={(e) => setFechaHasta(e.target.value)}
                        required
                    />
                    <button type="submit" className="btn btn-success mt-3">Confirmar</button>
                </form>

                {mensaje && <div className="mt-3">{mensaje}</div>}
            </div>
            {/* Tabla de días libres */}
            <h4 className="mt-4">Días libres registrados:</h4>
            <table className="table mt-4">
                <thead>
                    <tr>
                        <th>Fecha Desde</th>
                        <th>Fecha Hasta</th>
                        <th>Acción</th>
                    </tr>
                </thead>
                <tbody>
                    {diasLibres.length > 0 ? (
                        diasLibres.map((dia, index) => (
                            <tr key={index}>
                                <td>{new Date(dia.fecha_desde).toLocaleDateString("es-ES")}</td>
                                <td>{new Date(dia.fecha_hasta).toLocaleDateString("es-ES")}</td>
                                <td>
                                    <button
                                        className="btn btn-danger"
                                        onClick={() => handleDelete(dia.id)} // Pasa el id del día libre a eliminar
                                    >
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="3">No hay días libres registrados.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}