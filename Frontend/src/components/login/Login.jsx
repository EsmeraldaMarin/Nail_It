import React, { useState } from "react";

import { useNavigate } from 'react-router-dom';
import './Login.scss';
import { Link } from "react-router-dom";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate(); // Hook para redirigir
    
    const handleSubmit = (event) => {
        event.preventDefault();

        // Validación básica
        if (email === "" || password === "") {
            setErrorMessage("Por favor, completa ambos campos.");
            return;
        }

        // Autenticación simulada 
        if (email === "admin" && password === "ohmynails") {
            navigate('/inicio'); // Redirige a Inicio
        } else {
            setErrorMessage("Email o contraseña incorrectos.");
        }
    };

    return (
        <div className="login-container" id="login-container">

            <form onSubmit={handleSubmit} className="row g-3">
                <div className="form-group col-md-6">
                    <label className="form-label">Email:</label>
                    <input
                        type="text"
                        value={email}
                        className="form-control"
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className="form-group col-md-6">
                    <label htmlFor="inputPassword5" className="form-label">Contraseña:</label>
                    <input
                        type="password" id="inputPassword5" className="form-control" aria-describedby="passwordHelpBlock"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                </div>
                {errorMessage && <p className="error-message">{errorMessage}</p>}

                <div className="col-12">
                    <button className="btn btn-primary" type="submit">Iniciar sesión</button>
                    <a href="#" >Olvidé mi contraseña</a>
                </div>
                <hr></hr>
                <div className="col-12">
                    <span>¿Sos nuevo por aquí?</span>
                    <Link to="/registro" className="btn btn-secondary">Registrarme</Link>
                </div>
            </form>
        </div>
    );
};

export default Login;
