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
import RutaProtegida from "./components/login/RutaProtegida";
import SideBar from "./components/inicio_admin/SideBar";
import EstilistaManager from "./components/gestion_estilistas/EstilistaManager";
import Historial_turnos from "./components/historial_turnos_cli/Historial";
import AccountInfo from "./components/cliente_configuracion/AccountInfo";
import Servicio from "./components/Especialidad/Servicio"

import Footer from "./components/footer/Footer";

function App() {
    return (
        <div className="App">
            <Routes>
                {/* Ruta para el cliente con rutas anidadas */}
                <Route path="/inicio/*" element={<RutaProtegida><ClienteLayout /></RutaProtegida>}>
                    <Route path="" element={<Inicio />} />
                    <Route path="configuracion_cuenta" element={<AccountInfo />} />
                    <Route path="mis_reservas" element={<Historial_turnos />}></Route>
                </Route>

                {/* Ruta para el admin con rutas anidadas */}
                <Route path="/inicio_admin/*" element={<RutaProtegida><SideBar /><InicioAdmin /></RutaProtegida>}>
                    <Route index element={<ReservasConfirmadas />} />
                    <Route path="reservas_pendientes" element={<ReservasPendientes />} />
                    <Route path="horarios" element={<Horarios />} />
                    <Route path="servicios" element={<Servicio/>} />
                    <Route path="gestion_estilistas" element={<EstilistaManager />} />
                </Route>

                {/* Rutas básicas */}
                <Route path="/" element={<Navigate to="/login" />} />
                <Route path="/login" element={<Login />}></Route>
                <Route path="/registro" element={<Registro />}></Route>
                <Route path="/inicio" element={<Inicio />}></Route>
            </Routes>
        </div>
    );
}

const ClienteLayout = () => {
    return (
        <>
            <Header></Header>
            <Routes>
                <Route path="/" element={<Inicio />} />
                <Route path="/configuracion_cuenta" element={<AccountInfo />} />
                <Route path="/mis_reservas" element={<Historial_turnos />}></Route>
            </Routes>
            <Footer></Footer>
        </>
    );
};

export default App;
