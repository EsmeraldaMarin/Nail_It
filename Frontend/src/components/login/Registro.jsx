import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import './Registro.scss';
import axios from '../../axiosConfig/axiosConfig';
const Registro = ({ mensajeBoton = "Registrarme", isAdminParam = false, redirect = "/login", handleSubmitAdmin = () => { } }) => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate(); // Hook para redirigir
    const [errorMessage, setErrorMessage] = useState("");
    const [formData, setFormData] = useState({
        nombre: '',
        apellido: '',
        email: '',
        numero: '',
        password: '',
        confirmPassword: '',
        isAdmin: isAdminParam
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: value // 
        });
    };

    // Maneja el envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();
        // Validación básica
        const { nombre, apellido, email, numero, password, confirmPassword } = formData;

        if (!nombre || !apellido || !email || !numero || !password || !confirmPassword) {
            setErrorMessage("Todos los campos son obligatorios.");
            return;
        }

        // Validación de formato de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setErrorMessage("Ingresa un correo válido.");
            return;
        }

        // Verificar que las contraseñas coincidan
        if (password !== confirmPassword) {
            setErrorMessage("Las contraseñas no coinciden.");
            return;
        }

        setLoading(true);
        try {
            let url = '/registro'
            if (formData.isAdmin == true) {
                url = '/admin/registro'
            }
            const response = await axios.post(url, {
                nombre: formData.nombre,
                apellido: formData.apellido,
                email: formData.email,
                numero: formData.numero,
                password: formData.password,
                isAdmin: formData.isAdmin
            });
            setLoading(false);
            handleSubmitAdmin(response.data)
            navigate(redirect)
        } catch (error) {
            console.error('Error en el registro:', error);
        }
        setFormData({
            nombre: '',
            apellido: '',
            email: '',
            numero: '',
            password: '',
            confirmPassword: '',
            isAdmin: isAdminParam
        })
        // Aquí se podría enviar el formulario a una API o servicio
        setErrorMessage(""); // Reiniciar mensajes de error
    };

    return (
        <div className="input-container" id='registro-container'>
            <div className="header">Nail It</div>

            <form onSubmit={handleSubmit} className="row g-3">
                <div className="form-group col-md-6">
                    <label className="form-label">Nombre</label>
                    <input
                        type="text"
                        name="nombre"
                        className="form-control"
                        value={formData.nombre}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group col-md-6">
                    <label className="form-label">Apellido</label>
                    <input
                        type="text"
                        name="apellido"
                        className="form-control"
                        value={formData.apellido}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group col-md-6">
                    <label className="form-label" htmlFor="username" >Email</label>
                    <input
                        id="username"
                        type="email"
                        name="email"
                        className="form-control"
                        value={formData.email}
                        onChange={handleChange}
                        autoComplete="username"
                        required
                    />
                </div>
                <div className="form-group col-md-6">
                    <label className="form-label" >Número de teléfono</label>
                    <input
                        type="tel"
                        name="numero"
                        className="form-control"
                        value={formData.numero}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group col-md-6">
                    <label className="form-label" htmlFor="password" >Contraseña</label>
                    <input
                        id="password"
                        type="password"
                        name="password"
                        className="form-control"
                        value={formData.password}
                        onChange={handleChange}
                        autoComplete="new-password"
                        required
                    />
                </div>
                <div className="form-group col-md-6">
                    <label className="form-label" htmlFor="password" >Repetir Contraseña</label>
                    <input
                        id="password"
                        type="password"
                        name="confirmPassword"
                        className="form-control"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        autoComplete="new-password"
                        required
                    />
                </div>

                {errorMessage && <p className="error-message">{errorMessage}</p>}
                <div className="col-12">
                    <button className="btn btn-primary" type="submit">{mensajeBoton}</button>
                </div>
                <hr></hr>
                <div className="col-12 pregunta_login">
                    <span>¿Ya tenés una cuenta?</span>
                    <Link to="/login" className="btn btn-secondary">Iniciar Sesión</Link>
                </div>
            </form>

            {loading && (<div className="modal show d-block" tabIndex="-1" role="dialog">
                <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content">
                        <div className="modal-body text-center">
                            <div className="loader" id="loader-1"></div>
                        </div>
                    </div>
                </div>
            </div>)}
        </div>
    );
};

export default Registro;
