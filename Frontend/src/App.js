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

function App() {
    return (
        <div className="App">
            <Header></Header>
            <Routes>
                <Route path="/inicio_admin" element={<InicioAdmin />}>
                    {/* Rutas internas que comparten el mismo layout */}
                    
                    <Route index element={<ReservasConfirmadas />} />
                    <Route path="reservas_pendientes" element={<ReservasPendientes />} />
                </Route>

                <Route path="/" element={<Navigate to="/login" />} />
                <Route path="/login" element={<Login />}></Route>
                <Route path="/registro" element={<Registro />}></Route>
                <Route path="/inicio" element={<Inicio />}></Route>
            </Routes>
        </div>
    );
}

export default App;
