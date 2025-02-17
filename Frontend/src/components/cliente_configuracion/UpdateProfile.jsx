import React, { useState, useEffect } from 'react';
import axios from '../../axiosConfig/axiosConfig';

const UpdateProfile = ({ clienteInfo, setClienteInfo, userId, modoEdicion, setModoEdicion }) => {

    const [message, setMessage] = useState('');
    const [clienteUpdatedData, setClienteUpdatedData] = useState({
        nombre: clienteInfo.nombre,
        apellido: clienteInfo.apellido,
        email: clienteInfo.email,
        numero: clienteInfo.numero
    })

    const handleUpdate = async () => {
        try {
            const response = await axios.put(`/cliente/${userId}`, clienteUpdatedData);
            setMessage('Profile updated successfully');
            setClienteInfo(clienteUpdatedData)
            setModoEdicion(!modoEdicion)
        } catch (error) {
            setMessage('Error updating profile');
            console.error('Error:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setClienteUpdatedData({
            ...clienteUpdatedData,
            [name]: value
        });
    };


    return (
        <div>
            <ul className="list-group list-group-flush">
                <li className="list-group-item d-flex justify-content-between align-items-center px-0">
                    <label htmlFor="input-nombre"><strong>Nombre</strong></label>
                    <input type="text" id="input-nombre" name="nombre" value={clienteUpdatedData.nombre} onChange={handleChange} />
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center px-0">
                    <label htmlFor="input-apellido"><strong>Apellido</strong></label>
                    <input type="text" id="input-apellido" name="apellido" value={clienteUpdatedData.apellido} onChange={handleChange} />
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center px-0">
                    <label htmlFor="input-numero"><strong>Telefono</strong></label>
                    <input type="text" id="input-numero" name="numero" value={clienteUpdatedData.numero} onChange={handleChange} />
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center px-0">
                    <label htmlFor="input-email"><strong>Email</strong></label>
                    <input type="text" id="input-email" name="email" value={clienteUpdatedData.email} onChange={handleChange} />
                </li>
            </ul>
            <div className="d-flex justify-content-between mt-3">
                <button className="btn btn-secondary" onClick={() => {
                    setClienteUpdatedData({})
                    setModoEdicion(!modoEdicion)
                }}>Cancelar cambios</button>
                <button className="btn btn-primary" onClick={() => {
                    handleUpdate()
                }}>Guardar cambios</button>
            </div>
        </div>
    );
};

export default UpdateProfile;
