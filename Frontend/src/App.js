import React from "react";
import Login from "./components/login/Login";
import { Routes, Route, Navigate } from 'react-router-dom';

import './custom.scss';
import Registro from "./components/login/Registro";
import Header from "./components/header/Header";
import Inicio from "./components/inicio/Inicio";
import InicioAdmin from "./components/inicio_admin/Inicio_admin";
import ReservasPendientes from "./components/reserva_admin/ReservasPendientes";
import ReservasConfirmadas from "./components/reserva_admin/ReservasConfirmadas";
import Horarios from "./components/horarios_estilista/Horarios";
import Servicios from "./components/servicios/Consulta"
import Historial_turnos from "./components/historial_turnos_cli/Historial";

function App() {
    return (
        <div className="App">
            <Header></Header>
            <Routes>
                <Route path="/inicio_admin" element={<InicioAdmin />}>
                    {/* Rutas internas que comparten el mismo layout */}
                    
                    <Route index element={<ReservasConfirmadas />} />
                    <Route path="reservas_pendientes" element={<ReservasPendientes />} />
                    <Route path="horarios" element={<Horarios />} />
                    <Route path="servicios" element={<Servicios />} />
                </Route>

                <Route path="/" element={<Navigate to="/login" />} />
                <Route path="/login" element={<Login />}></Route>
                <Route path="/registro" element={<Registro />}></Route>
                <Route path="/inicio" element={<Inicio />}></Route>
                <Route path="/historial" element={<Historial_turnos />}></Route>
            </Routes>
        </div>
    );
}

export default App;
