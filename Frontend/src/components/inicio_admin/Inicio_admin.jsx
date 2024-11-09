import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import SideBar from './SideBar';
import "./Inicio_admin.scss";
import { Outlet } from 'react-router-dom';
import FooterAdmin from '../footer/Footer_admin';
const Inicio_admin = () => {
<<<<<<< HEAD

    const userName = localStorage.getItem('userName');
    const handleClick = () => {
        const sideBar = document.getElementById("sideBar");
        const btn = document.getElementById("btn-toggle-menu");
=======
    const handleClick = () => { 
        const sideBar = document.getElementById("sideBar"); 
        const btn = document.getElementById("btn-toggle-menu"); 
>>>>>>> ecba6c62ded3697c51d1ad22b4f35c711d1fe836
        btn.classList.toggle('active');
        sideBar.classList.toggle('show');
    }
    return (
        <>
            <div className='inicio_admin d-flex flex-column'>
<<<<<<< HEAD
                <header className='d-flex justify-content-between px-3'>
                    <p className='soporte'></p>
                    <button className='btn-toggle-menu' id='btn-toggle-menu' onClick={handleClick}><span>Menú</span> <i className='bi bi-chevron-down' ></i></button>
                    <p className="text-end fs-5 p-0 m-0"><b>Bienvenida, {userName}!</b></p>

=======
                <header >
                    <button className='btn-toggle-menu' id='btn-toggle-menu' onClick={handleClick}><span>Menú</span> <i className='bi bi-chevron-down' ></i></button>
>>>>>>> ecba6c62ded3697c51d1ad22b4f35c711d1fe836
                </header>
                <div className='body-content'>
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