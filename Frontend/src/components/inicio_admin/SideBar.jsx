import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import "./Inicio_admin.scss";
import Logout from '../login/Logout';

const SideBar = () => {
    return (
        <nav className="sideBar" id='sideBar'>
            <div className='menu'>
                <div className='title'>
                    <h5 >Menú</h5>
                </div>
                <div >
                    <ul className="navbar-nav justify-content-end flex-grow-1 pe-3">
                        <li className="nav-item"><NavLink end to="/inicio_admin" className={({ isActive }) => (isActive ? 'active' : '')}><i className="bi bi-house"></i>Home</NavLink></li>
                        <li className="nav-item"><NavLink to="/inicio_admin/reservas_pendientes" className={({ isActive }) => (isActive ? 'active' : '')}><i className="bi bi-journal-bookmark"></i>Reservas pendientes</NavLink></li>
                        <li className="nav-item"><NavLink to="/inicio_admin/agenda" className={({ isActive }) => (isActive ? 'active' : '')}><i className="bi bi-calendar3"></i>Agenda</NavLink></li>
                        <li className="nav-item"><NavLink to="/inicio_admin/administracion_general" className={({ isActive }) => (isActive ? 'active' : '')}><i className="bi bi-people"></i>Administración General</NavLink></li>
                        {/* <li className="nav-item"><NavLink to="/inicio_admin/servicios" className={({ isActive }) => (isActive ? 'active' : '')}><i className="bi bi-bookmarks"></i>Servicios</NavLink></li> */}
                        <li className="nav-item"><NavLink to="/inicio_admin/horarios" className={({ isActive }) => (isActive ? 'active' : '')}><i className="bi bi bi-calendar4-range"></i>Horarios de Atención</NavLink></li>
                        <li className="nav-item"><NavLink to="/inicio_admin/reportes" className={({ isActive }) => (isActive ? 'active' : '')}><i className="bi bi-clipboard2"></i>Reportes</NavLink></li>
                        <li className="nav-item"><NavLink to="/inicio_admin/configuracion" className={({ isActive }) => (isActive ? 'active' : '')}><i className="bi bi-gear"></i>Configuración</NavLink></li>
                        <li className='nav-item logout'><Logout /></li>
                    </ul>
                </div>
                <Link to={'/inicio_admin'} className='brandName'>Oh My Nails</Link>
            </div>

        </nav>
    )
}
export default SideBar