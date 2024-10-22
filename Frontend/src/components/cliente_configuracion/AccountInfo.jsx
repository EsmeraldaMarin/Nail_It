import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UpdateProfile from './UpdateProfile';
import "./EstilosAccount.scss"

const AccountInfo = () => {
    const [clienteInfo, setClienteInfo] = useState(null);
    const [modoEdicion, setModoEdicion] = useState(false)
    const userId = localStorage.getItem('userId');

    useEffect(() => {
        const fetchClienteInfo = async () => {

            try {
                const response = await axios.get(`http://localhost:5050/cliente/${userId}`);
                setClienteInfo(response.data);
            } catch (error) {
                console.error('Error fetching client info:', error);
            }
        };
        fetchClienteInfo();
    }, []);

    if (!clienteInfo) return <p>Loading...</p>;

    return (
        <div className="container-sm account-info py-5 px-4 d-flex flex-column justify-content-center">
            <h3 className="text-center">Mi Cuenta</h3>
            {!modoEdicion &&
                <>
                    <ul className="list-group list-group-flush">
                        <li className="list-group-item d-flex justify-content-between align-items-center px-0">
                            <span><strong>Nombre</strong></span>
                            <span>{clienteInfo.nombre}</span>
                        </li>
                        <li className="list-group-item d-flex justify-content-between align-items-center px-0">
                            <span><strong>Apellido</strong></span>
                            <span>{clienteInfo.apellido}</span>
                        </li>
                        <li className="list-group-item d-flex justify-content-between align-items-center px-0">
                            <span><strong>Telefono</strong></span>
                            <span>{clienteInfo.numero}</span>
                        </li>
                        <li className="list-group-item d-flex justify-content-between align-items-center px-0">
                            <span><strong>Email</strong></span>
                            <span>{clienteInfo.email}</span>
                        </li>
                    </ul>
                    <button className="btn btn-dark mt-3" onClick={() => setModoEdicion(!modoEdicion)}>Editar</button>
                </>
            }
            {modoEdicion && <UpdateProfile clienteInfo={clienteInfo} setClienteInfo={setClienteInfo} userId={userId} modoEdicion={modoEdicion} setModoEdicion={setModoEdicion} />}
        </div>
    );
};

export default AccountInfo;
