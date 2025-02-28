import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import Logout from '../login/Logout';

const Menu = () => {

    const isLogged = localStorage.getItem("auth")
    /*const closeOffcanvas = () => {
        // Encontrar el offcanvas activo y cerrarlo
        const offcanvasElement = document.getElementById('offcanvasNavbar');
        const bsOffcanvas = window.bootstrap.Offcanvas.getInstance(offcanvasElement);
        if (bsOffcanvas) {
            bsOffcanvas.hide();
        }

        // Forzar la eliminación de la clase 'show' y el fondo oscuro
        offcanvasElement.classList.remove('show');
        document.body.classList.remove('offcanvas-open'); // Esto elimina el fondo oscuro (overlay)
        const backdrop = document.querySelector('.offcanvas-backdrop');
        if (backdrop) {
            backdrop.remove(); // Elimina el fondo oscuro (si sigue presente)
        }
    };
*/
    return (
        <nav className="navbar navbar-expand-lg fixed-top">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/inicio/">Oh My Nails</Link>
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
                            <li className="nav-item">
                                <NavLink end to="/inicio" className={({ isActive }) => (isActive ? 'active' : '')}>
                                    <i className="bi bi-house"></i> Inicio
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink to="/inicio/realizar_reserva" className={({ isActive }) => (isActive ? 'active' : '')}>
                                    <i className="bi bi-bag"></i> Realizar reserva
                                </NavLink>
                            </li>

                            {isLogged &&
                                <li className="nav-item">
                                    <NavLink to="/inicio/mis_reservas" className={({ isActive }) => (isActive ? 'active' : '')}>
                                        <i className="bi bi-journal-bookmark"></i> Mis Reservas
                                    </NavLink>
                                </li>
                            }

                            {isLogged &&
                                <li className="nav-item">
                                    <NavLink to="/inicio/configuracion_cuenta" className={({ isActive }) => (isActive ? 'active' : '')}>
                                        <i className="bi bi-person"></i> Mi Cuenta
                                    </NavLink>
                                </li>

                            }
                            {isLogged &&
                                <li className="nav-item logout">
                                    <Logout />
                                </li>
                            }
                            {!isLogged &&
                                <li className="nav-item">
                                    <NavLink to="/login" className={({ isActive }) => (isActive ? 'active' : '')}>
                                        <i className="bi bi-person"></i> Iniciar Sesión
                                    </NavLink>
                                </li>
                            }
                        </ul>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Menu;
