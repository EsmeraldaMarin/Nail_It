import React, { useState, useEffect } from 'react';
import './../gestion_estilistas/Estilistas.scss';
import axios from '../../axiosConfig/axiosConfig';
import './PerfilAdmin.scss'

function PerfilAdmin() {
    const [profile, setProfile] = useState({});
    const [newProfileData, setNewProfileData] = useState({
        nombre: '',
        apellido: '',
        numero: '',
        email: '',
    });
    const [newPassword, setNewPassword] = useState({
        password: '',
        new_password: '',
        password_confirmation: '',
    });

    const [sendingRequestProfile, setSendingRequestProfile] = useState(false);
    const [showAlertMessageProfile, setShowAlertMessageProfile] = useState(false);
    const [alertMessageClassNameProfile, setAlertMessageClassNameProfile] = useState("alert alert-success");
    const [alertMessageTextProfile, setAlertMessageTextProfile] = useState("");

    const [sendingRequestPassword, setSendingRequestPassword] = useState(false);
    const [showAlertMessagePassword, setShowAlertMessagePassword] = useState(false);
    const [alertMessageClassNamePassword, setAlertMessageClassNamePassword] = useState("alert alert-success");
    const [alertMessageTextPassword, setAlertMessageTextPassword] = useState("");

    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchProfesional = async () => {
            try {
                const response = await axios.get("/admin/" + userId);
                let profile = response.data;
                delete profile.password;

                setProfile(profile);
                setNewProfileData(profile);
            } catch (error) {
                console.error('Error al obtener información del perfil', error);
            }
        };

        fetchProfesional();
    }, [userId]);

    const handleGuardarCambios = async () => {
        try {
            setSendingRequestProfile(true);
            setShowAlertMessageProfile(false);
            delete newProfileData.password;

            await axios.put(`/admin/${profile.id}`, newProfileData).then((response) => {
                setProfile({ ...profile, ...newProfileData });

                setAlertMessageClassNameProfile("alert alert-success");
                setAlertMessageTextProfile("Información actualizada con éxito.");
            }).catch((error) => {
                console.error('Error al actualizar perfil', error);

                setAlertMessageClassNameProfile("alert alert-danger");
                setAlertMessageTextProfile("Error al actualizar información");
            }).finally(() => {
                setSendingRequestProfile(false);
                setShowAlertMessageProfile(true);
            });
        } catch (error) {
            console.error('Error al realizar la modificación', error);
        }
    };

    const handleCambiarPassword = async () => {
        try {
            setSendingRequestPassword(true);
            setShowAlertMessagePassword(false);

            await axios.post(`/admin/${profile.id}/change_password`, newPassword, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            }).then((response) => {
                setAlertMessageClassNamePassword("alert alert-success");
                setAlertMessageTextPassword("Contraseña actualizada correctamente.");

            }).catch((error) => {
                console.error('Error al actualizar perfil', error.response.data.message);

                setAlertMessageClassNamePassword("alert alert-danger");

                const message = error.response.data.message;

                if (message == "Invalid authorization token") {
                    setAlertMessageTextPassword("Error de autenticación, por favor volver a ingresar.");
                }
                else if (message == "Resource not found") {
                    setAlertMessageTextPassword("Error interno, volver a intentar");
                }
                else if (message == "Missing new password") {
                    setAlertMessageTextPassword("Por favor ingresar la nueva contraseña");
                }
                else if (message == "Invalid password_confirmation") {
                    setAlertMessageTextPassword("Error al confirmar nueva contraseña");
                }
                else if (message == "Invalid password") {
                    setAlertMessageTextPassword("Contraseña actual incorrecta");
                }
                else if (message == "New password cannot be the same as current password") {
                    setAlertMessageTextPassword("La nueva contraseña no puede ser la misma que la actual.");
                }
                else {
                    setAlertMessageTextPassword(message);
                }
            }).finally(() => {
                setSendingRequestPassword(false);
                setShowAlertMessagePassword(true);
            });
        } catch (error) {
            console.error('Error al realizar la modificación', error);
        }
    };


    return (
        <div className='perfil_admin'>
            <div className="d-flex justify-content-between">
                <h3>Mi Perfil</h3>
            </div>
            <div className='tables-ctn'>
                <div className="table-ctn datos">
                    {profile && (
                        <>
                            <div className="card text-dark bg-light">
                                <div className="card-header">Actualizar información</div>
                                <div className="card-body">
                                    <form>
                                        {showAlertMessageProfile && (
                                            <div className={alertMessageClassNameProfile} role="alert">
                                                {alertMessageTextProfile}
                                            </div>
                                        )}
                                        <div className="mb-3">
                                            <label htmlFor="exampleInputEmail1" className="form-label">Nombre</label>
                                            <input
                                                disabled={sendingRequestProfile}
                                                value={newProfileData.nombre}
                                                onChange={(e) => setNewProfileData({ ...newProfileData, nombre: e.target.value })}
                                                type="text"
                                                className="form-control" />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="exampleInputEmail1" className="form-label">Apellido</label>
                                            <input disabled={sendingRequestProfile}
                                                value={newProfileData.apellido}
                                                onChange={(e) => setNewProfileData({ ...newProfileData, apellido: e.target.value })}
                                                type="text"
                                                className="form-control" />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="exampleInputEmail1" className="form-label">Email</label>
                                            <input disabled={sendingRequestProfile}
                                                value={newProfileData.email}
                                                onChange={(e) => setNewProfileData({ ...newProfileData, email: e.target.value })}
                                                type="email"
                                                className="form-control" />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="exampleInputEmail1" className="form-label">Telefono</label>
                                            <input disabled={sendingRequestProfile}
                                                value={newProfileData.numero}
                                                onChange={(e) => setNewProfileData({ ...newProfileData, numero: e.target.value })}
                                                type="text"
                                                className="form-control" />
                                        </div>
                                        <button disabled={sendingRequestProfile}
                                            type="button"
                                            className="btn btn-primary"
                                            onClick={handleGuardarCambios}>Guardar Cambios</button>
                                    </form>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                <div className="table-ctn password">
                    <div className="card text-dark bg-light">
                        <div className="card-header">Cambiar contraseña</div>
                        <div className="card-body">
                            <form>
                                {showAlertMessagePassword && (
                                    <div className={alertMessageClassNamePassword} role="alert">
                                        {alertMessageTextPassword}
                                    </div>
                                )}
                                <div className="mb-3">
                                    <label htmlFor="exampleInputPassword1" className="form-label">Contraseña Actual</label>
                                    <input disabled={sendingRequestPassword}
                                        value={newPassword.password}
                                        onChange={(e) => setNewPassword({ ...newPassword, password: e.target.value })}
                                        type="password"
                                        className="form-control" />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="exampleInputPassword1" className="form-label">Nueva Contraseña</label>
                                    <input disabled={sendingRequestPassword}
                                        value={newPassword.new_password}
                                        onChange={(e) => setNewPassword({ ...newPassword, new_password: e.target.value })}
                                        type="password"
                                        className="form-control" />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="exampleInputPassword1" className="form-label">Confirmar Nueva Contraseña</label>
                                    <input disabled={sendingRequestPassword}
                                        value={newPassword.password_confirmation}
                                        onChange={(e) => setNewPassword({ ...newPassword, password_confirmation: e.target.value })}
                                        type="password"
                                        className="form-control" />
                                </div>
                                <button disabled={sendingRequestPassword}
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={handleCambiarPassword}>Cambiar Contraseña</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PerfilAdmin;
