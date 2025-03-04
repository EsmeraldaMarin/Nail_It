import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from 'react-router-dom';
import './Login.scss';
import { Link } from "react-router-dom";
import axios from '../../axiosConfig/axiosConfig';
import ChangePasswordModal from "./ChangePasswordModal";

const Login = () => {
    const [errorMessage, setErrorMessage] = useState("");
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [showModal, setShowModal] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [parametrosDeBusqueda] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (parametrosDeBusqueda.get("registro") === "true") setShowAlert(true);
        setTimeout(() => setShowAlert(false), 3000);
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (formData.email === "" || formData.password === "") {
            setErrorMessage("Por favor, completa ambos campos.");
            return;
        }

        try {
            let response = await axios.post('/login', formData);
            handleLoginSuccess(response);
        } catch (error) {
            try {
                let response = await axios.post('/admin/login', formData);
                handleLoginSuccess(response, true);
            } catch (error) {
                setErrorMessage('Usuario o contraseña incorrecta');
            }
        }
    };

    const handleLoginSuccess = (response, isAdmin = false) => {
        localStorage.setItem('userId', response.data.usuario.id);
        localStorage.setItem('userEmail', response.data.usuario.email);
        localStorage.setItem('userName', response.data.usuario.nombre);
        localStorage.setItem('auth', "true");
        localStorage.setItem('token', response.data.token);

        if (response.data.mustChangePassword) {
            setShowModal(true);
            setFormData(prev => ({ ...prev, userId: response.data.usuario.id }));
        } else {
            navigate(isAdmin ? "/inicio_admin" : "/inicio");
        }
    };

    return (
        <div className="login-container" id="login-container">
            <div className="header">Nail It</div>
            {showAlert &&
                <div className="alert alert-success d-flex align-items-center" style={{ position: "absolute", top: "70px", right: "30px" }} role="alert">
                    <i className="bi bi-check fs-2 me-3"></i>
                    ¡Usuario registrado exitosamente!
                </div>
            }
            <form onSubmit={handleSubmit} className="row g-3">
                <div className="form-group col-md-6">
                    <label className="form-label" htmlFor="username">Email:</label>
                    <input
                        id="username"
                        type="email"
                        name="email"
                        value={formData.email}
                        className="form-control"
                        onChange={handleChange}
                        autoComplete="username"
                        required
                    />
                </div>
                <div className="form-group col-md-6">
                    <label htmlFor="password" className="form-label">Contraseña:</label>
                    <input
                        type="password"
                        id="password"
                        className="form-control"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        autoComplete="current-password"
                        required
                    />
                </div>
                {errorMessage && <p className="error-message">{errorMessage}</p>}
                <div className="col-12">
                    <button className="btn btn-primary" type="submit">Iniciar sesión</button>
                    <Link to={'/forgot-password'}>Olvidé mi contraseña</Link>
                </div>
                <hr />
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
