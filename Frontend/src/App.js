import React from "react";
import { Routes, Route, Navigate } from 'react-router-dom';

import './custom.scss';
import './index.css';

import Login from "./components/login/Login";
import Registro from "./components/login/Registro";
import Header from "./components/header/Header";
import Inicio from "./components/inicio/Inicio";
import InicioAdmin from "./components/inicio_admin/Inicio_admin";
import ReservasPendientes from "./components/reserva_admin/ReservasPendientes";
import ReservasConfirmadas from "./components/reserva_admin/ReservasConfirmadas";
import Horarios from "./components/horarios_estilista/Horarios";
import Servicios from "./components/servicios/Consulta";
import RutaProtegida from "./components/login/RutaProtegida";
import SideBar from "./components/inicio_admin/SideBar";
import EstilistaManager from "./components/gestion_estilistas/EstilistaManager";
import AccountInfo from "./components/cliente_configuracion/AccountInfo";

function App() {
    return (
        <div className="App">
            <Routes>
                {/* Ruta para el cliente con rutas anidadas */}
                <Route path="/inicio/*" element={
                    <RutaProtegida><ClienteLayout /></RutaProtegida>
                }>
                    <Route path="" element={<Inicio />} />
                    <Route path="configuracion_cuenta" element={<AccountInfo />} />
                    {/* Agrega más rutas de cliente aquí */}
                </Route>

                {/* Ruta para el admin con rutas anidadas */}
                <Route path="/inicio_admin/*" element={<RutaProtegida><SideBar /><InicioAdmin /></RutaProtegida>}>
                    <Route index element={<ReservasConfirmadas />} />
                    <Route path="reservas_pendientes" element={<ReservasPendientes />} />
                    <Route path="horarios" element={<Horarios />} />
                    <Route path="servicios" element={<Servicios />} />
                    <Route path="gestion_estilistas" element={<EstilistaManager />} />
                </Route>

                {/* Rutas básicas */}
                <Route path="/" element={<Navigate to="/login" />} />
                <Route path="/login" element={<Login />} />
                <Route path="/registro" element={<Registro />} />
            </Routes>
        </div>
    );
}

const ClienteLayout = () => {
    return (
        <>
            <Header /> {/* Header solo visible en rutas del cliente */}
            <Routes>
                <Route path="/" element={<Inicio />} />
                <Route path="/configuracion_cuenta" element={<AccountInfo />} />
                {/* Aquí puedes agregar más rutas del cliente si es necesario */}
            </Routes>
        </>
    );
};

export default App;
