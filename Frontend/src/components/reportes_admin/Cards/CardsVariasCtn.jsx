import React, { useState, useEffect } from "react";
import '../Reportes.scss'
import CardIngresosGenerados from "./CardIngresosGenerados";
import CardConcurrencia from "./CardConcurrencia";
import CardServicios from "./CardServicios";
import axios from '../../../axiosConfig/axiosConfig'

const CardsVariasCtn = ({ especialidades, servicios, operadoras }) => {
    const [datosConcurrencia, setDatosConcurrencia] = useState([])
    const [datosConcurrenciaMensual, setDatosConcurrenciaMensual] = useState([])
    const [demandaServicios, setDemandaServicios] = useState([])
    const [ingresosTotales, setIngresosTotales] = useState('')
    const getFormattedUTCDate = () => {
        const now = new Date();

        const year = now.getUTCFullYear();
        const month = (now.getUTCMonth() + 1).toString().padStart(2, "0");
        const day = now.getUTCDate().toString().padStart(2, "0");

        // Hora en 00:00:00.000
        const hours = "00";
        const minutes = "00";
        const seconds = "00";
        const milliseconds = "000";

        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds} +00:00`;
    };
    const [fechaDesdeSeleccionada, setFechaDesdeSeleccionada] = useState(getFormattedUTCDate());
    const [fechaHastaSeleccionada, setFechaHastaSeleccionada] = useState(getFormattedUTCDate());
    const [especialidadSeleccionada, setEspecialidadSeleccionada] = useState('');
    const [servicioSeleccionado, setServicioSeleccionado] = useState('');
    const [operadoraSeleccionada, setOperadoraSeleccionada] = useState('');

    useEffect(() => {
        getConcurrenciaReservas();
        getConcurrenciaMensualReservas();
        getDemandaServicios();
    }, [])
    useEffect(() => {
        getIngresosGenerados();
    }, [fechaDesdeSeleccionada,
        fechaHastaSeleccionada,
        especialidadSeleccionada,
        servicioSeleccionado,
        operadoraSeleccionada]);


    const getIngresosGenerados = async () => {
        const response = await axios.get('/reserva');
        const reservasFiltradas = response.data.filter(reserva =>
            reserva.estado === "realizada" &&
            (!especialidadSeleccionada || reserva.Servicio.Especialidad.id == especialidadSeleccionada) &&
            (!servicioSeleccionado || reserva.Servicio.id == servicioSeleccionado) &&
            (!operadoraSeleccionada || reserva.Admin.id == operadoraSeleccionada) &&
            (!fechaDesdeSeleccionada || reserva.fecha >= fechaDesdeSeleccionada) &&
            (!fechaHastaSeleccionada || reserva.fecha <= fechaHastaSeleccionada)
        );

        const totalIngresos = reservasFiltradas.reduce((acc, reserva) => acc + reserva.montoTotal, 0);
        setIngresosTotales(totalIngresos);
    };

    const getConcurrenciaReservas = async () => {
        const response = await axios.get('/reserva');
        const concurrencia = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

        response.data.forEach(reserva => {
            const hora = reserva.horaInicio.split(':')[0]; // Suponiendo que el campo se llama "horario"
            concurrencia[hora - 8] = (concurrencia[hora - 8] || 0) + 1;
        });
        setDatosConcurrencia(concurrencia); // Retornar datos listos para un gráfico
    };

    const getConcurrenciaMensualReservas = async () => {
        try {
            const response = await axios.get('/reserva');
            const concurrencia = Array(12).fill(0); // Inicializa un array de 12 posiciones en 0

            response.data.forEach(reserva => {
                if (!reserva.fecha) return; // Verificar que la fecha exista

                const fecha = new Date(reserva.fecha.split(" ")[0]); // Convertir a objeto Date
                const mesIndex = fecha.getMonth(); // Obtener el índice del mes (0-11)

                concurrencia[mesIndex] += 1; // Sumar 1 a la concurrencia de ese mes
            });

            setDatosConcurrenciaMensual(concurrencia);
        } catch (error) {
            console.error("Error obteniendo concurrencia de reservas:", error);
        }
    };


    const getDemandaServicios = async () => {
        const response = await axios.get('/reserva');
        const demanda = {};

        response.data.forEach(reserva => {
            const servicio = reserva.Servicio.nombre;
            demanda[servicio] = (demanda[servicio] || 0) + 1;
        });
        setDemandaServicios(demanda);
    };

    return (
        <div className="cardsVarias-ctn">
            <CardIngresosGenerados
                ingresosTotales={ingresosTotales}
                exportarAExcel={() => { }}
                handleChangeEspecialidad={(e) => setEspecialidadSeleccionada(e.target.value)}
                handleChangeServicio={(e) => setServicioSeleccionado(e.target.value)}
                handleChangeOperadora={(e) => setOperadoraSeleccionada(e.target.value)}
                fechaDesde={fechaDesdeSeleccionada}
                fechaHasta={fechaHastaSeleccionada}
                setFechaDesde={setFechaDesdeSeleccionada}
                setFechaHasta={setFechaHastaSeleccionada}
                especialidades={especialidades}
                servicios={servicios}
                operadoras={operadoras}></CardIngresosGenerados>
            <CardConcurrencia data={datosConcurrencia} dataMeses={datosConcurrenciaMensual}></CardConcurrencia>
            <CardServicios data={demandaServicios}></CardServicios>
            {/*<CardIngresosChart></CardIngresosChart>*/}
        </div>
    )
};

export default CardsVariasCtn;