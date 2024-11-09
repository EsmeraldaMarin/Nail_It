

const ReservasAReembolzar = ({ reservas, handleReembolzoReserva, formatearFecha }) => {

    const userId = localStorage.getItem('userId');
    const reservasReembolso = reservas.filter(
        reserva => reserva.estado === "por_reembolsar" && reserva.id_profesional === userId

    );

    console.log("Reservas por reembolso: ", reservasReembolso);



    return (
        <div>
            <h4 className="py-3">Reservas pendientes de reembolzar</h4>

            <div className="table-ctn pb-2 reservas-pendientes" >
                <div className="table-responsive">
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
                                <th scope="col">CBU o Alias</th>
                                <th scope="col">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reservasReembolso.map((reserva, index) =>

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
                                    <td><strong>{reserva.Cliente.cbu}</strong></td>
                                    <td>
                                        {
                                            <div>
                                                <button className="btn btn-danger" onClick={() => {
                                                        if (window.confirm("Esta confimando la cancelacion de la reserva, asegurese de haber devuelto la seña")) {
                                                            handleReembolzoReserva(reserva.id, reserva);
                                                        }}}>
                                                    cancelar Reserva
                                                </button>

                                            </div>
                                        }

                                    </td>
                                </tr>
                            )}


                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )


}


export default ReservasAReembolzar