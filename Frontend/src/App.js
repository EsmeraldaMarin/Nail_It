import React from "react";
import Login from "./components/login/Login";
import { Routes, Route, Navigate } from 'react-router-dom';

import './custom.scss';
import Registro from "./components/login/Registro";
import Header from "./components/header/Header";
import Inicio from "./components/Inicio";

function App() {
    return (
        <div className="App">
            <Header></Header>
            <Routes>
                <Route path="/" element={<Navigate to="/login" />} />

                <Route path="/login" element={<Login />}></Route>
                <Route path="/registro" element={<Registro />}></Route>
                <Route path="/inicio" element={<Inicio />}></Route>
            </Routes>
        </div>
    );
}

export default App;
