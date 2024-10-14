import React from 'react';
import { NavLink } from 'react-router-dom';
import Logout from '../login/Logout';

const Menu = () => {
    return (
        <nav className="navbar navbar-expand-lg fixed-top">
            <div className="container-fluid">
                <a className="navbar-brand" href="#">Reservas en Oh My Nails</a>
                <button className="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasNavbar" aria-controls="offcanvasNavbar" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="offcanvas offcanvas-end" tabIndex="-1" id="offcanvasNavbar" aria-labelledby="offcanvasNavbarLabel">
                    <div className="offcanvas-header">
                        <h5 className="offcanvas-title" id="offcanvasNavbarLabel">Menu</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                    </div>
                    <div className="offcanvas-body menu">
                        <ul className="navbar-nav justify-content-end flex-grow-1 pe-3">
                            <li className="nav-item"><NavLink end to="/inicio" className={({ isActive }) => (isActive ? 'active' : '')}><i className="bi bi-house"></i>Realizar Reserva</NavLink></li>
                            <li className="nav-item"><NavLink to="/inicio/mis_reservas" className={({ isActive }) => (isActive ? 'active' : '')}><i className="bi bi-journal-bookmark"></i>Mis Reservas</NavLink></li>
                            <li className="nav-item"><NavLink to="/inicio/servicios" className={({ isActive }) => (isActive ? 'active' : '')}><i className="bi bi-journal-bookmark"></i>Servicios</NavLink></li>
                            <li className="nav-item"><NavLink to="/inicio/configuracion_cuenta" className={({ isActive }) => (isActive ? 'active' : '')}><i className="bi bi-journal-bookmark"></i>Mi Cuenta</NavLink></li>
                            <li className='nav-item logout'><Logout/></li>

                        </ul>
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Menu;
