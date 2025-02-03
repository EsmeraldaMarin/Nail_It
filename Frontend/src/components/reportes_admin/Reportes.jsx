import axios from "../../axiosConfig/axiosConfig";
import React, { useState, useEffect } from "react";
import CardReporteReserva from "./Cards/CardReporteReserva";
import './Reportes.scss'
import CardReporteReservasPendientes from "./Cards/CardReservasPendientes";
import CardsVariasCtn from "./Cards/CardsVariasCtn";


const Reportes = () => {
    const [especialidades, setEspecialidades] = useState([])
    const [servicios, setServicios] = useState([])
    const [operadoras, setOperadoras] = useState([])
    const [reservasPendientes, setReservasPendientes] = useState([])
    const [reservasPorReembolsar, setReservasPorReembolsar] = useState([])
    const [reservasCanceladas, setReservasCanceladas] = useState([])
    const [reservasNoRealizada, setReservasNoRealizada] = useState([])
    const [reservasRealizada, setReservasRealizada] = useState([])

    useEffect(() => {
        const fetchDatos = async () => {
            try {
                const especialidadesResponse = await axios.get('/especialidad');
                const serviciosResponse = await axios.get('/servicio');
                const operadorasResponse = await axios.get('/admin');
                const todasLasReservas = await axios.get('/reserva');
                setReservasPendientes(todasLasReservas.data.filter(reserva => reserva.estado === "pendiente"))
                setReservasPorReembolsar(todasLasReservas.data.filter(reserva => reserva.estado === "por_reembolsar"))
                setReservasCanceladas(todasLasReservas.data.filter(reserva => reserva.estado === "cancelada"))
                setReservasNoRealizada(todasLasReservas.data.filter(reserva => reserva.estado === "no_realizada"))
                setReservasRealizada(todasLasReservas.data.filter(reserva => reserva.estado === "realizada"))
                setEspecialidades(especialidadesResponse.data);
                setServicios(serviciosResponse.data);
                setOperadoras(operadorasResponse.data);
            } catch (error) {
                console.error('Error al obtener los datos', error);
            }
        }
        fetchDatos()
    }, [])




    return (
        <div className="reportes">
            <div className="cards-ctn d-flex flex-wrap justify-content-evenly">
                <CardReporteReservasPendientes index={'1'} cantReservasAConfirmar={reservasPendientes.length} cantReservasAReembolsar={reservasPorReembolsar.length} />
                <CardReporteReserva index={'2'} cantidadReservas={reservasRealizada.length} tipoReserva={'reservas realizadas'} handleClickVerLista={() => { }} handleChangePeriodo={() => { }} />
                <CardReporteReserva index={'3'} cantidadReservas={reservasNoRealizada.length} tipoReserva={'reservas no realizadas'} handleClickVerLista={() => { }} handleChangePeriodo={() => { }} />
                <CardReporteReserva index={'4'} cantidadReservas={reservasCanceladas.length} tipoReserva={'reservas canceladas'} handleClickVerLista={() => { }} handleChangePeriodo={() => { }} />
            </div>
            <div className="table-ctn">
                {operadoras && <CardsVariasCtn
                    especialidades={especialidades}
                    servicios={servicios}
                    operadoras={operadoras}></CardsVariasCtn>}
            </div>
        </div>
    )
};

export default Reportes;