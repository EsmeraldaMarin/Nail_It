import React, { useEffect, useState } from "react";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { es } from 'date-fns/locale';
import format from "date-fns/format";

const CardReporteReserva = ({ index, porcentaje, cantidadReservas, tipoReserva, handleClickVerLista, handleChangePeriodo }) => {
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
    let tipoReservaAMostrar;
    if (tipoReserva === "realizada") tipoReservaAMostrar = "servicios_realizados";
    if (tipoReserva === "no_realizada") tipoReservaAMostrar = "servicios_no_realizados";
    if (tipoReserva === "cancelada") tipoReservaAMostrar = "reservas_canceladas";

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
    }, [dateRange, cantidadReservas]); // Se actualiza cuando cambia `dateRange`
    useEffect(() => {
        setRangoAMostrar(obtenerRangoAMostrar());
    }, []);


    return (
        <div className="card-reporte-reserva mb-3 position-relative">
            <h5 className="text-capitalize d-flex justify-content-between">
                Total {tipoReservaAMostrar?.replaceAll("_", " ")}
                {/*<i className="bi bi-info-circle info-sobre-reservas" >
                    <span><strong className="text-decoration-underline text-capitalize">info</strong>: Se consideran las reservas que corresponden a <strong className="text-decoration-underline">todas</strong> las operadoras.</span>
                </i>*/}
            </h5>

            <div className="d-flex align-items-center justify-content-between mt-3">
                <button className="btn p-0 text-decoration-underline seleccionar-periodo" onClick={() => setShowCalendar(!showCalendar)}>
                    Seleccionar Período<i className="ms-2 bi bi-calendar3"></i>
                </button>
                <button className="btn-ver-lista d-flex flex-nowrap text-nowrap" onClick={() => handleClickVerLista(tipoReserva, rangoAMostrar)}>
                    Ver Lista <i className="ms-2 bi bi-card-list"></i>
                </button>
            </div>
            <div className="text-center mt-2 pt-3 p-0 mb-0" style={{ borderTop: "1px solid #eee", borderBottom: "1px solid #eee", lineHeight: "5px" }}>{rangoAMostrar}</div>
            {showCalendar && (
                <div className="calendar-container mt-0 bg-secondary d-flex flex-column p-2" style={{ position: "absolute", zIndex: "20", top:"100px" }}>
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

            <div className="d-flex flex-column justify-content-center mt-3">
                <p className=" fw-bold text-center cantidad-number" style={{ fontSize: "5em" }}>
                    {cantidadReservas}
                </p>
            </div>
            <i className="me-2 text-center porcentaje" style={{ width: "100%", display: "inline-block", transform: "translateY(-30px)" }}>
                Representan un <strong className="fs-5">{porcentaje}%</strong> de las reservas totales
            </i>
        </div>
    );
};

export default CardReporteReserva;
