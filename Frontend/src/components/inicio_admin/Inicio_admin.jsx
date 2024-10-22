import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import SideBar from './SideBar';
import "./Inicio_admin.scss";
import { Outlet } from 'react-router-dom';
import FooterAdmin from '../footer/Footer_admin';
const Inicio_admin = () => {
    const handleClick = () => { 
        const sideBar = document.getElementById("sideBar"); 
        const btn = document.getElementById("btn-toggle-menu"); 
        btn.classList.toggle('active');
        sideBar.classList.toggle('show');
    }
    return (
        <>
            <div className='inicio_admin d-flex flex-column'>
                <header >
                    <button className='btn-toggle-menu' id='btn-toggle-menu' onClick={handleClick}><span>Menú</span> <i className='bi bi-chevron-down' ></i></button>
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