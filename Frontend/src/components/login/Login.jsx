import React, { useState } from "react";

import { useNavigate } from 'react-router-dom';
import './Login.scss';
import { Link } from "react-router-dom";
import axios from '../../axiosConfig/axiosConfig';

const Login = () => {
    const [errorMessage, setErrorMessage] = useState("");
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const navigate = useNavigate()

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Validación básica
        if (formData.email === "" || formData.password === "") {
            setErrorMessage("Por favor, completa ambos campos.");
            return;
        }
        try {
            const response = await axios.post('/login', {
                email: formData.email,
                password: formData.password,
            });
            // Almacena el token en localStorage
            localStorage.setItem('token', response.data.token);

            // Redirigir o hacer algo después del inicio de sesión
            console.log('Inicio de sesión exitoso', response.data.token);
            navigate('/inicio');
        } catch (error) {
            setError('Usuario o contraseña incorrecta');
        }

    };

    return (
        <div className="login-container" id="login-container">

            <form onSubmit={handleSubmit} className="row g-3">
                <div className="form-group col-md-6">
                    <label className="form-label">Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        className="form-control"
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group col-md-6">
                    <label htmlFor="inputPassword5" className="form-label">Contraseña:</label>
                    <input
                        type="password" id="inputPassword5" className="form-control" aria-describedby="passwordHelpBlock"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
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
