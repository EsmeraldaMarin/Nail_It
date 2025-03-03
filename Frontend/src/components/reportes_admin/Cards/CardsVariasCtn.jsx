import React, { useState, useEffect } from "react";
import '../Reportes.scss'
import CardIngresosGenerados from "./CardIngresosGenerados";
import CardConcurrencia from "./CardConcurrencia";
import CardServicios from "./CardServicios";
import axios from '../../../axiosConfig/axiosConfig'

const CardsVariasCtn = ({ especialidades, servicios, operadoras }) => {
    const [ingresosTotales, setIngresosTotales] = useState('')
    const [cantidadDeServicios, setCantidadDeServicios] = useState('')
    const [especialidadSeleccionada, setEspecialidadSeleccionada] = useState('');
    const [reservas, setReservas] = useState([]);
    const [servicioSeleccionado, setServicioSeleccionado] = useState('');
    const [operadoraSeleccionada, setOperadoraSeleccionada] = useState('');

    const formatearFechaSinHorasParaDB = (fecha) => {
        const fechaUTC = new Date(fecha).toISOString().replace("T", " ").replace("Z", " +00:00");
        let fechaSplit = fechaUTC.split(" ");
        //se considera solo la fecha sin la hora
        return fechaSplit[0];
    };

    const fetchRealizadasByPeriodo = async (startDate, endDate) => {
        try {
            const { data } = await axios.get(
                `/reserva?fecha_desde=${formatearFechaSinHorasParaDB(startDate)}&fecha_hasta=${formatearFechaSinHorasParaDB(endDate)}&estado=realizada`
            );
            setReservas(data);
        } catch (error) {
            console.error("Error al obtener reservas:", error);
        }
    };

    useEffect(() => {
        const calcularIngresos = () => {
            const reservasFiltradas = reservas.filter(reserva =>
                (!especialidadSeleccionada || reserva.Servicio.Especialidad.id == especialidadSeleccionada) &&
                (!servicioSeleccionado || reserva.Servicio.id == servicioSeleccionado) &&
                (!operadoraSeleccionada || reserva.Admin.id == operadoraSeleccionada)
            );
            const total = reservasFiltradas.reduce((acc, reserva) => acc + reserva.montoTotal, 0);
            setIngresosTotales(total);
            setCantidadDeServicios(reservasFiltradas.length)
        };

        calcularIngresos();
    }, [reservas, especialidadSeleccionada, servicioSeleccionado, operadoraSeleccionada]);


    return (
        <div className="cardsVarias-ctn">
            <CardIngresosGenerados
                ingresosTotales={ingresosTotales}
                cantidadDeServicios={cantidadDeServicios}
                handleChangeEspecialidad={(e) => setEspecialidadSeleccionada(e.target.value)}
                handleChangeServicio={(e) => setServicioSeleccionado(e.target.value)}
                handleChangeOperadora={(e) => setOperadoraSeleccionada(e.target.value)}
                especialidades={especialidades}
                servicios={servicios}
                operadoras={operadoras}
                handleChangePeriodo={fetchRealizadasByPeriodo}
            ></CardIngresosGenerados>
            <CardConcurrencia></CardConcurrencia>
            <CardServicios></CardServicios>
            {/*<CardIngresosChart></CardIngresosChart>*/}
        </div>
    )
};

export default CardsVariasCtn;