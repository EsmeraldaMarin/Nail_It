import { Link } from 'react-router-dom';
import '../Reportes.scss';
import React, { useEffect, useState } from "react";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { es } from 'date-fns/locale';
import format from "date-fns/format";

const CardReporteReservasPendientes = ({ index, tipoReserva, cantReservasAConfirmar, cantReservasAReembolsar, handleClickVerLista, handleChangePeriodo }) => {
    const [showCalendar, setShowCalendar] = useState(false);
    const [rangoAMostrar, setRangoAMostrar] = useState("");
    const [seCambioElRango, setSeCambioElRango] = useState(false) //esto me sirve para que en el primer render aparezca el txto "todas hasta hoy"
    const [dateRange, setDateRange] = useState([
        {
            startDate: new Date(),
            endDate: new Date(),
            key: "selection",
        },
    ]);

    const handleSelect = (ranges) => {
        setSeCambioElRango(true)
        setDateRange([ranges.selection]);
    };

    const handleAplicarPeriodo = () => {
        const { startDate, endDate } = dateRange[0];
        handleChangePeriodo(startDate, endDate, tipoReserva);
        setShowCalendar(false); // Oculta el calendario después de aplicar
    };

    const obtenerRangoAMostrar = () => {
        const { startDate, endDate } = dateRange[0];

        if (!seCambioElRango) return <p>Todas hasta el <strong>{new Date().toLocaleDateString()}</strong></p>
        return (startDate.getTime() !== endDate.getTime())
            ? <p>Del <strong>{startDate.toLocaleDateString()}</strong> al{" "} <strong>{endDate.toLocaleDateString()}</strong></p>
            : <p className="text-capitalize"><strong>{format(endDate, 'EEEE dd/MM', { locale: es })}</strong> </p>
    }

    useEffect(() => {
        setRangoAMostrar(obtenerRangoAMostrar());
    }, [dateRange, cantReservasAReembolsar, cantReservasAConfirmar]); // Se actualiza cuando cambia `dateRange`
    useEffect(() => {
        setRangoAMostrar(obtenerRangoAMostrar());
    }, []);


    return (
        <div className="card-reporte-reserva mb-3 d-flex flex-column justify-content-between position-relative">
            <h4 className="text-capitalize d-flex justify-content-between">Total Reservas Pendientes
                <i className="bi bi-info-circle info-sobre-reservas">
                    <span><strong className="text-decoration-underline text-capitalize">info</strong>: Se consideran las reservas que corresponden a <strong className="text-decoration-underline">todas</strong> las operadoras.</span>
                </i>
            </h4>
            <div className="d-flex align-items-center justify-content-between mt-2">
                <button className="btn p-0 text-decoration-underline" onClick={() => setShowCalendar(!showCalendar)}>
                    Seleccionar Período<i className="ms-2 bi bi-calendar3"></i>
                </button>
                <button className="btn-ver-lista d-flex flex-nowrap text-nowrap" onClick={() => handleClickVerLista(tipoReserva, rangoAMostrar)}>
                    Ver Lista <i className="ms-2 bi bi-card-list"></i>
                </button>
            </div>
            <div className="text-center mt-2 pt-3 p-0 mb-0" style={{ borderTop: "1px solid #eee", borderBottom: "1px solid #eee", lineHeight: "5px" }}>{rangoAMostrar}</div>
                        {showCalendar && (
                            <div className="calendar-container mt-3 bg-secondary d-flex flex-column p-2" style={{ position: "absolute", top:"155px", zIndex: "20" }}>
                                <DateRange
                                    ranges={dateRange}
                                    onChange={handleSelect}
                                    moveRangeOnFirstSelection={false}
                                    showSelectionPreview={true}
                                    months={1}
                                    direction="horizontal"
                                    locale={es}
                                    rangeColors={['#050095da', '#050095da', '#050095da']}
                                />
                                <button className="btn btn-primary mt-2" onClick={handleAplicarPeriodo} style={{ backgroundColor: "#050095da" }}>Aplicar</button>
                            </div>
                        )}
            <div className="d-flex justify-content-between mt-2">
                <div className="d-flex flex-column justify-content-center">
                    <span className="text-center">Por Confirmar</span>
                    <p className="m-0 fw-bold text-center" style={{ fontSize: "4em", transform: 'translatey(-20px)' }}>{cantReservasAConfirmar}</p>
                </div>
                <div className="d-flex flex-column justify-content-center">
                    <span className="text-center">Por Reembolsar</span>
                    <p className="m-0 fw-bold text-center" style={{ fontSize: "4em", transform: 'translatey(-20px)' }}>{cantReservasAReembolsar}</p>
                </div>
            </div>
            <div className="d-flex align-items-end justify-content-center" style={{ transform: 'translateY(-33px)' }}>
                <Link className="btn btn-outline-secondary p-0 px-2 fw-bold" style={{ color: "#050095da" }} to={'/inicio_admin/reservas_pendientes'}>Ir a mis Reservas Pendientes</Link>

            </div>
        </div>
    )
};

export default CardReporteReservasPendientes;