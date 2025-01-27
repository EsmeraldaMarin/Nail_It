import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import SideBar from './SideBar';
import "./Inicio_admin.scss";
import { Outlet } from 'react-router-dom';
import FooterAdmin from '../footer/Footer_admin';
const Inicio_admin = () => {

    const userName = localStorage.getItem('userName');
    const handleClick = () => {
        const sideBar = document.getElementById("sideBar");
        const btn = document.getElementById("btn-toggle-menu");
        btn.classList.toggle('active');
        sideBar.classList.toggle('show');
    }
    return (
        <>
            <div className='inicio_admin d-flex flex-column'>
                <header className='d-flex justify-content-between px-3'>
                    <Link to={'/inicio_admin'} className='soporte'>
                        <img src="/img/logo_nailit.png" alt="Logo Oh My Nails" />
                    </Link>
                    <button className='btn-toggle-menu' id='btn-toggle-menu' onClick={handleClick}><span>Menú</span> <i className='bi bi-chevron-down' ></i></button>
                    <p className="text-end fs-5 p-0 m-0"><b>Bienvenida, {userName}!</b></p>
                </header>
                <div className='body-content overflow-x-auto'>
                    <SideBar></SideBar>
                    <div className='content'>
                        <div className="dashboard">
                            <Outlet></Outlet>
                        </div>
                        <FooterAdmin></FooterAdmin>
                    </div>
                </div>
            </div>
        </>

    );
};

export default Inicio_admin;