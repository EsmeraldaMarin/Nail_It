import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ChangePasswordModal = ({ show, onClose, userId }) => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate()

    const handleChangePassword = async () => {

        try {
            // Verificar que las contraseñas coincidan
            if (newPassword !== confirmPassword) {
                console.log(newPassword, confirmPassword)
                setErrorMessage("Las contraseñas no coinciden.");
                return;
            }
            const response = await axios.put(`http://localhost:5050/admin/${userId}`, {
                password: newPassword,
                mustChangePassword: false,
            });

            onClose();

            localStorage.setItem('token', response.data.token);
            navigate("/inicio_admin");
        } catch (error) {
            console.error('Error changing password', error);
            setErrorMessage("Ocurrió un error. Intentelo otra vez.");

        }
    };

    return (
        <Modal show={show} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Bienvenida!</Modal.Title>
            </Modal.Header>
            <Modal.Body>

                <p>Como es tu primer inicio de sesión debes <strong>cambiar tu contraseña</strong>:</p>
                <div className="form-group col-md-6">
                    <label className="form-label">Contraseña</label>
                    <input
                        type="password"
                        name="password"
                        className="form-control"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                </div>
                <div className="form-group col-md-6 mt-3">
                    <label className="form-label">Repetir contraseña</label>
                    <input
                        type="password"
                        name="confirmPassword"
                        className="form-control"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </div>

                {errorMessage && <p className="text-danger">{errorMessage}</p>}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>Cerrar</Button>
                <Button variant="primary" onClick={handleChangePassword}>Guardar constraseña</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ChangePasswordModal;
