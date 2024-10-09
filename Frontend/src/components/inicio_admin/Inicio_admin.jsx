import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import SideBar from './SideBar';
import "./Inicio_admin.scss";
import { Outlet } from 'react-router-dom';
const Inicio_admin = () => {
    return (
        <>
            
            <div className='container-fluid inicio_admin'>
                <div className="dashboard">
                    <Outlet></Outlet>
                </div>
            </div>
        </>

    );
};

export default Inicio_admin;