import React, { useState, useEffect } from "react";
import '../Reportes.scss'
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

const CardIngresosGenerados = (
    { ingresosTotales,
        cantidadDeServicios,
        handleChangeEspecialidad,
        handleChangeServicio,
        handleChangeOperadora,
        servicios, especialidades, operadoras,
        handleChangePeriodo }) => {

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
    /*
    const [sePuedeMoverFecha, setSePuedeMoverFecha] = useState(true);
    const [periodo, setPeriodo] = useState('dia')
    */
    const formatPrice = (price) => {
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(price || 0);
    };

   
    /*
     const getFormattedUTCDate = (fecha = new Date()) => {

        const year = fecha.getUTCFullYear();
        const month = (fecha.getUTCMonth() + 1).toString().padStart(2, "0");
        const day = fecha.getUTCDate().toString().padStart(2, "0");

        // Hora en 00:00:00.000
        const hours = "00";
        const minutes = "00";
        const seconds = "00";
        const milliseconds = "000";

        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds} +00:00`;
    };

        const avanzarFecha = () => {
    
            let nuevaFechaDesde = new Date(new Date(fechaDesde).getTime() + new Date().getTimezoneOffset() * 60000);
            let nuevaFechaHasta = new Date(new Date(fechaHasta).getTime() + new Date().getTimezoneOffset() * 60000);
            if (periodo === "dia") {
                nuevaFechaDesde.setDate(nuevaFechaDesde.getDate() + 1);
                nuevaFechaHasta.setDate(nuevaFechaHasta.getDate() + 1);
            }
            if (periodo === "mes") {
                nuevaFechaDesde.setMonth(nuevaFechaDesde.getMonth() + 1);
                nuevaFechaHasta.setMonth(nuevaFechaHasta.getMonth() + 1);
            }
    
            setFechaDesde(getFormattedUTCDate(nuevaFechaDesde));
            setFechaHasta(getFormattedUTCDate(nuevaFechaHasta));
        };
    
        const retrocederFecha = () => {
            let nuevaFechaDesde = new Date(new Date(fechaDesde).getTime() + new Date().getTimezoneOffset() * 60000);
            let nuevaFechaHasta = new Date(new Date(fechaHasta).getTime() + new Date().getTimezoneOffset() * 60000);
            if (periodo === "dia") {
                nuevaFechaDesde.setDate(nuevaFechaDesde.getDate() - 1);
                nuevaFechaHasta.setDate(nuevaFechaHasta.getDate() - 1);
            }
            if (periodo === "mes") {
                nuevaFechaDesde.setMonth(nuevaFechaDesde.getMonth() - 1);
                nuevaFechaHasta.setMonth(nuevaFechaHasta.getMonth() - 1);
            }
            setFechaDesde(getFormattedUTCDate(nuevaFechaDesde));
            setFechaHasta(getFormattedUTCDate(nuevaFechaHasta));
        };
    
        const formatearFecha = (fecha) => {
            const fechaLocal = new Date(new Date(fecha).getTime() + new Date().getTimezoneOffset() * 60000);
            return format(fechaLocal, 'EEEE dd/MM', { locale: es });
        };
    
        const obtenerTitulo = () => {
            if (periodo === 'dia') return formatearFecha(fechaDesde)
            return new Date(fechaHasta).toLocaleString('es-ES', { month: 'long' })
        }
    */
    
        //funcionalidad para seleccionar periodo
    const handleSelect = (ranges) => {
        setSeCambioElRango(true)
        setDateRange([ranges.selection]);
    };

    const handleAplicarPeriodo = () => {
        const { startDate, endDate } = dateRange[0];
        handleChangePeriodo(startDate, endDate);
        setShowCalendar(false); // Oculta el calendario después de aplicar
    };
    const obtenerRangoAMostrar = () => {
        const { startDate, endDate } = dateRange[0];

        if (!seCambioElRango) return <p>Ingresos de hoy: <strong>{new Date().toLocaleDateString()}</strong></p>
        return (startDate.getTime() !== endDate.getTime())
            ? <p>Del <strong>{startDate.toLocaleDateString()}</strong> al{" "} <strong>{endDate.toLocaleDateString()}</strong></p>
            : <p className="text-capitalize"><strong>{format(endDate, 'EEEE dd/MM', { locale: es })}</strong> </p>
    }

    useEffect(() => {
        setRangoAMostrar(obtenerRangoAMostrar());
    }, [dateRange]);

    useEffect(() => {
        const { startDate, endDate } = dateRange[0];
        handleChangePeriodo(startDate, endDate);
    }, []);

    return (
        <div className="card-ingresos-generados" style={{ minWidth: "350px" }}>
            <h4 className="text-capitalize mb-0">Total Ingresos Generados</h4>
            <p className="p-0 m-0"><i className="bi bi-info-circle"></i> Solo se considera el importe total de los servicios realizados</p>
            <div className="d-flex flex-column justify-content-center position-relative">
                {/*<div className="periodo d-flex justify-content-center align-items-center">
                    {sePuedeMoverFecha && <button className="btn-directions btn btn-secondary mx-2" onClick={retrocederFecha}>{'<'}</button>}
                    <span className="fs-5 text-capitalize text-center" style={{ minWidth: "7em" }}>{sePuedeMoverFecha ? obtenerTitulo() : fechaDesde + " : " + fechaHasta}</span>
                    {sePuedeMoverFecha && <button className="btn-directions btn btn-secondary mx-2" onClick={avanzarFecha}>{'>'}</button>}
                </div>*/}
                <div className="d-flex align-items-center justify-content-between">
                    <button className="btn p-0 text-decoration-underline" onClick={() => setShowCalendar(!showCalendar)}>
                        Seleccionar Período<i className="ms-2 bi bi-calendar3"></i>
                    </button>
                </div>
                {showCalendar && (
                    <div className="calendar-container bg-secondary d-flex flex-column p-2" style={{ position: "absolute", top: "45px", zIndex: "20" }}>
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
                <div className="text-center mt-2 pt-3 p-0 mb-0" style={{ borderTop: "1px solid #eee", borderBottom: "1px solid #eee", lineHeight: "5px" }}>{rangoAMostrar}</div>

                <span className="m-0 fw-bold text-center my-3" style={{ fontSize: "3em" }}>{formatPrice(ingresosTotales)}</span>
                <span className="m-0 text-center my-0">Cantidad de servicios realizados: <strong className="fs-5">{cantidadDeServicios}</strong></span>
            </div>

            {/*<div className="d-flex flex-column ctn-input-periodo">
                <div className="d-flex justify-content-center position-relative">
                    <input type="radio" className="btn-check btn-toggle" name="options-base" id="ingresos-dia" autoComplete="off"
                        onChange={() => {
                            setPeriodo('dia')
                            setFechaDesde(getFormattedUTCDate());
                            setFechaHasta(getFormattedUTCDate());
                        }} checked={periodo === "dia"} />

                    <label className="py-0 px-3 btn btn-toggle" htmlFor="ingresos-dia">Día</label>
                    <input type="radio" className="btn-check btn-toggle" name="options-base" id="ingresos-mes" autoComplete="off"
                        onChange={() => {
                            const primerDia = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
                            const ultimoDia = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);
                            setPeriodo('mes')
                            setFechaDesde(getFormattedUTCDate(primerDia));
                            setFechaHasta(getFormattedUTCDate(ultimoDia));
                        }} checked={periodo === "mes"} />
                    <label className="py-0 px-3 btn btn-toggle" htmlFor="ingresos-mes">Mes</label>
                </div>
            </div>*/}
            <div className="input-group mb-3 mt-3">
                <label className="input-group-text" htmlFor="inputGroupSelect01">Especialidad</label>
                <select className="form-select" id="inputGroupSelect01" onChange={handleChangeEspecialidad}>
                    <option value=''>Todas</option>
                    {especialidades?.map((especialidad, index) =>
                        <option key={index} value={especialidad.id}>{especialidad.nombre}</option>
                    )}
                </select>
            </div>
            <div className="input-group mb-3">
                <label className="input-group-text" htmlFor="inputGroupSelect01">Servicio</label>
                <select className="form-select" id="inputGroupSelect01" onChange={handleChangeServicio}>
                    <option value=''>Todas</option>
                    {servicios?.map((servicio, index) =>
                        <option key={index} value={servicio.id}>{servicio.nombre}</option>
                    )}
                </select>
            </div>
            <div className="input-group mb-3">
                <label className="input-group-text" htmlFor="inputGroupSelect01">Operadora</label>
                <select className="form-select" id="inputGroupSelect01" onChange={handleChangeOperadora}>
                    <option value=''>Todas</option>
                    {operadoras?.map((operadora, index) =>
                        <option key={index} value={operadora.id}>{operadora.nombre}</option>
                    )}
                </select>
            </div>
            {/*<button className="btn-ver-lista" onClick={exportarAExcel} style={{ color: '#2d572c' }}>
                Exportar a Excel
                <i className="bi bi-file-earmark-excel ms-2"></i>
            </button>*/}
        </div>
    )
};

export default CardIngresosGenerados;
