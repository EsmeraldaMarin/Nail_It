import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import './Registro.scss';
import axios from '../../axiosConfig/axiosConfig';
const Registro = () => {
    const navigate = useNavigate(); // Hook para redirigir
    const [errorMessage, setErrorMessage] = useState("");
    const [formData, setFormData] = useState({
        nombre: '',
        apellido: '',
        email: '',
        numero: '',
        password: '',
        confirmPassword: ''
    });


    // Maneja el cambio de cada input
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
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

        try {
            const response = await axios.post('/registro', {
                nombre: formData.nombre,
                apellido: formData.apellido,
                email: formData.email,
                numero: formData.numero,
                password: formData.password,
            });
            navigate('/login')
        } catch (error) {
            console.error('Error en el registro:', error);
        }

        // Aquí se podría enviar el formulario a una API o servicio
        console.log('Datos enviados:', formData);
        setErrorMessage(""); // Reiniciar mensajes de error
    };

    return (
        <div className="input-container" id='registro-container'>

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
                        name="numero"
                        className="form-control"
                        value={formData.numero}
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
