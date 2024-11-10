import React, { useState } from "react";

import { useNavigate } from 'react-router-dom';
import './Login.scss';
import { Link } from "react-router-dom";
import axios from '../../axiosConfig/axiosConfig';
import ChangePasswordModal from "./ChangePasswordModal";

const Login = () => {
    const [errorMessage, setErrorMessage] = useState("");
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        isAdmin: false
    });
    const [showModal, setShowModal] = useState(false);

    const navigate = useNavigate()

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value // Si es checkbox, tomamos el valor de checked (true o false)
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
            let url = '/login'
            if (formData.isAdmin == true) {
                url = '/admin/login'
            }
            const response = await axios.post(url, {
                email: formData.email,
                password: formData.password,
            });
            localStorage.setItem('userId', response.data.usuario.id);
            localStorage.setItem('userEmail', response.data.usuario.email);
            localStorage.setItem('userName', response.data.usuario.nombre);
            localStorage.setItem('auth', "true");
            if (response.data.mustChangePassword) {
                // Muestra el modal 
                setShowModal(true);
                setFormData({
                    ...formData,
                    userId: response.data.usuario.id
                });
            } else {
                // Almacena el token en localStorage 
                localStorage.setItem('token', response.data.token);

                // Redirigir o hacer algo después del inicio de sesión 
                if (formData.isAdmin) {
                    navigate("/inicio_admin");

                } else {
                    navigate("/inicio");
                }
            }
        } catch (error) {
            setErrorMessage('Usuario o contraseña incorrecta');
        }

    };

    return (
        <div className="login-container" id="login-container">
            <div className="header">Nail It</div>
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
                <div className="form-group col-md-6 form-check">
                    <label className="form-check-label" htmlFor="gridCheck1">Soy admin</label>
                    <input
                        className="form-check-input"
                        type="checkbox"
                        checked={formData.isAdmin}
                        name="isAdmin"
                        onChange={handleChange}
                        id="gridCheck1"
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
            <ChangePasswordModal show={showModal} onClose={() => setShowModal(false)} userId={formData.userId} />
        </div>
    );
};

export default Login;
