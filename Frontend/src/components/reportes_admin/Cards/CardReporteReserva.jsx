import React, { useState, useEffect } from "react";

const CardReporteReserva = ({ index, cantidadReservas, tipoReserva, handleClickVerLista, handleChangePeriodo }) => {
    return (
        <div className="card-reporte-reserva mb-3">
            <h4 className="text-capitalize d-flex justify-content-between">Total reservas {tipoReserva.replace("_", " ")}s
                <i className="bi bi-info-circle info-sobre-reservas">
                    <span><strong className="text-decoration-underline text-capitalize">info</strong>: Se consideran las reservas que corresponden a <strong className="text-decoration-underline">todas</strong> las operadoras.</span>
                </i>
            </h4>

            <div className="d-flex ctn-input-periodo">
                <input type="radio" className="btn-check" name="options-base" id={index + "dia"} autoComplete="off" onChange={handleChangePeriodo} />
                <label className="py-0 px-3 btn btn-primary" htmlFor={index + "dia"}>Día</label>
                <input type="radio" className="btn-check" name="options-base" id={index + "semana"} autoComplete="off" onChange={handleChangePeriodo} />
                <label className="py-0 px-3 mx-2 btn btn-secondary" htmlFor={index + "semana"}>Semana</label>
                <input type="radio" className="btn-check" name="options-base" id={index + "mes"} autoComplete="off" onChange={handleChangePeriodo} />
                <label className="py-0 px-3 me-2 btn btn-secondary" htmlFor={index + "mes"}>Mes</label>
                {/*<button className="btn-seleccionar-periodo" onClick={handleChangePeriodo}>Seleccionar Período</button>*/}
            </div>

            <div className="d-flex flex-column justify-content-center mt-3">
                <div className="periodo d-flex justify-content-center align-items-center">
                    <button className="btn-directions btn btn-secondary mx-2">{'<'}</button>
                    <span className="fs-5">30/01/2025</span>
                    <button className="btn-directions btn btn-secondary mx-2">{'>'}</button>
                </div>
                <p className="m-0 fw-bold text-center" style={{ fontSize: "5em", transform: 'translatey(-20px)' }}>{cantidadReservas}</p>
            </div>
            <div className="d-flex align-items-end justify-content-between " style={{ transform: 'translateY(-45px)' }}>
                <button className="btn-ver-lista" onClick={() => handleClickVerLista(tipoReserva)}>Ver Lista</button>
                <i ></i>
            </div>
        </div>
    )
};

export default CardReporteReserva;