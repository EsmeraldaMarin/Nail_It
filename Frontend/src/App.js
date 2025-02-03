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
import EstilistaManager from "./components/gestion_estilistas/EstilistaManager";
import Historial_turnos from "./components/historial_turnos_cli/Historial";
import AccountInfo from "./components/cliente_configuracion/AccountInfo";
import Servicio from "./components/Especialidad/Servicio"
import Footer from "./components/footer/Footer";
import ReservaContext from "./components/reserva/reservaContext";
import constructionImage from './img/construction.svg'
import Vacaciones from "./components/horarios_estilista/Vacaciones";
import AgendaReservas from "./components/agenda_admin/AgendaReservas";
import ConfiguracionAdmin from "./components/configuracion_admin/ConfiguracionAdmin";
import ScrollToTop from "./ScrollToTop";
import Reportes from "./components/reportes_admin/Reportes";
import PerfilAdmin from "./components/perfil_admin/PerfilAdmin";

function App() {
    return (
        <div className="App">
            <ScrollToTop></ScrollToTop>
            <Routes>

                {/* Ruta para el cliente con rutas anidadas */}
                <Route path="/inicio/*" element={<RutaProtegida><ClienteLayout /></RutaProtegida>}>
                    <Route path="" element={<Inicio />} />
                    <Route path="realizar_reserva" element={<ReservaContext />}></Route>
                    <Route path="configuracion_cuenta" element={<AccountInfo />} />
                    <Route path="mis_reservas" element={<Historial_turnos />}></Route>
                </Route>

                {/* Ruta para el admin con rutas anidadas */}
                <Route path="/inicio_admin/*" element={<RutaProtegida><InicioAdmin /></RutaProtegida>}>
                    <Route index element={<ReservasConfirmadas />} />
                    <Route path="reservas_pendientes" element={<ReservasPendientes />} />
                    <Route path="horarios" element={<div className="d-flex flex-wrap"><Horarios /><Vacaciones /></div>} />
                    <Route path="horarios" element={<Horarios />} />
                    <Route path="servicios" element={<Servicio />} />
                    <Route path="administracion_general" element={<div className="accordion" id="accordionExample"><Servicio /> <EstilistaManager /></div>} />
                    <Route path="configuracion" element={<ConfiguracionAdmin />}></Route>
                    <Route path="reportes" element={<Reportes></Reportes>}></Route>
                    <Route path="agenda" element={<AgendaReservas />}></Route>
                    <Route path="perfil" element={<PerfilAdmin/>}></Route>
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
                <Route path="/realizar_reserva" element={<ReservaContext />}></Route>
            </Routes>
            <Footer></Footer>
        </>
    );
};

export default App;
