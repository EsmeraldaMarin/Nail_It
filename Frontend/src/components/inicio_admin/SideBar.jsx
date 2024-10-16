import React from 'react';
import { NavLink } from 'react-router-dom';
import "./Inicio_admin.scss";
import Logout from '../login/Logout';

const SideBar = () => {
    return (
        <nav className="aside navbar bg-body-tertiary fixed-top">
            <div className="container-fluid">
                <button className="btn btn-primary nav-toggle" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasScrolling" aria-controls="offcanvasScrolling"><span className="navbar-toggler-icon"></span></button>

                <div className="offcanvas offcanvas-start menu show" data-bs-scroll="true" data-bs-backdrop="false" tabIndex="-1" id="offcanvasScrolling" aria-labelledby="offcanvasScrollingLabel">
                    <div className="offcanvas-header">
                        <h5 className="offcanvas-title" id="offcanvasNavbarLabel">Menú</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                    </div>
                    <div className="offcanvas-body">
                        <ul className="navbar-nav justify-content-end flex-grow-1 pe-3">
                            <li className="nav-item"><NavLink end to="/inicio_admin" className={({ isActive }) => (isActive ? 'active' : '')}><i className="bi bi-house"></i>Home</NavLink></li>
                            <li className="nav-item"><NavLink to="/inicio_admin/reservas_pendientes" className={({ isActive }) => (isActive ? 'active' : '')}><i className="bi bi-journal-bookmark"></i>Reservas pendientes</NavLink></li>
                            <li className="nav-item"><NavLink to="/inicio_admin/horarios" className={({ isActive }) => (isActive ? 'active' : '')}><i className="bi bi-calendar-week"></i>Horarios de Atención</NavLink></li>
                            <li className="nav-item"><NavLink to="/inicio_admin/agenda" className={({ isActive }) => (isActive ? 'active' : '')}><i className="bi bi-calendar-week"></i>Agenda</NavLink></li>
                            <li className="nav-item"><NavLink to="/inicio_admin/gestion_estilistas" className={({ isActive }) => (isActive ? 'active' : '')}><i className="bi bi-people"></i>Gestion Estilistas</NavLink></li>
                            <li className="nav-item"><NavLink to="/inicio_admin/servicios" className={({ isActive }) => (isActive ? 'active' : '')}><i className="bi bi-bookmarks"></i>Servicios</NavLink></li>
                            <li className="nav-item"><NavLink to="/inicio_admin/configuracion" className={({ isActive }) => (isActive ? 'active' : '')}><i className="bi bi-gear"></i>Configuración</NavLink></li>
                            <li className="nav-item"><NavLink to="/inicio_admin/estadisticas" className={({ isActive }) => (isActive ? 'active' : '')}><i className="bi bi-bar-chart"></i>Estadísticas</NavLink></li>
                            <li className='nav-item logout'><Logout /></li>
                        </ul>
                    </div>
                </div>
            </div>
        </nav>
    )
}
export default SideBar