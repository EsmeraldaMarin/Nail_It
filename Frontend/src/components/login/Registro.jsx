import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Registro.scss';
const Registro = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
    });

    const [errorMessage, setErrorMessage] = useState("");

    // Maneja el cambio de cada input
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    // Maneja el envío del formulario
    const handleSubmit = (e) => {
        e.preventDefault();

        // Validación básica
        const { firstName, lastName, email, phone, password, confirmPassword } = formData;

        if (!firstName || !lastName || !email || !phone || !password || !confirmPassword) {
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

        // Aquí se podría enviar el formulario a una API o servicio
        console.log('Datos enviados:', formData);
        setErrorMessage(""); // Reiniciar mensajes de error
        alert('¡Registro exitoso!');
    };

    return (
        <div className="input-container" id='registro-container'>

            <form onSubmit={handleSubmit} className="row g-3">
                <div className="form-group col-md-6">
                    <label className="form-label">Nombre</label>
                    <input
                        type="text"
                        name="firstName"
                        className="form-control"
                        value={formData.firstName}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group col-md-6">
                    <label className="form-label">Apellido</label>
                    <input
                        type="text"
                        name="lastName"
                        className="form-control"
                        value={formData.lastName}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group col-md-6">
                    <label className="form-label">Email</label>
                    <input
                        type="email"
                        name="email"
                        className="form-control"
                        value={formData.email}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group col-md-6">
                    <label className="form-label">Número de teléfono</label>
                    <input
                        type="tel"
                        name="phone"
                        className="form-control"
                        value={formData.phone}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group col-md-6">
                    <label className="form-label">Contraseña</label>
                    <input
                        type="password"
                        name="password"
                        className="form-control"
                        value={formData.password}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group col-md-6">
                    <label className="form-label">Repetir Contraseña</label>
                    <input
                        type="password"
                        name="confirmPassword"
                        className="form-control"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                    />
                </div>
                {errorMessage && <p className="error-message">{errorMessage}</p>}
                <div className="col-12">
                    <button className="btn btn-primary" type="submit">Registrarme</button>
                </div>
                <hr></hr>
                <div className="col-12">
                    <span>¿Ya tenés una cuenta?</span>
                    <Link to="/login" className="btn btn-secondary">Iniciar Sesión</Link>
                </div>
            </form>
        </div>
    );
};

export default Registro;
