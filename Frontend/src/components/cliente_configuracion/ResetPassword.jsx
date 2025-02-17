import { useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../../axiosConfig/axiosConfig';
import { Link } from 'react-router-dom';

const ResetPassword = () => {
    const { token } = useParams();
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [estilos, setEstilos] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`/auth/reset-password/${token}`, { password });
            setMessage(response.data.message);
            setEstilos('bg-success')
        } catch (error) {
            setEstilos('bg-danger')
            setMessage(error.response?.data?.message || "Error al restablecer la contraseña");
        }
    };

    return (
        <div className='d-flex flex-column align-items-center'>
            <div style={{ height: "60px", boxShadow: "0 0 5px #bbb", width: "100vw" }}></div>
            <img className="my-5" src="/img/logo_nailit.png" alt="logo nail it" style={{ width: "200px" }} />
            <h2>Restablecer Contraseña</h2>
            <form className="mt-3" onSubmit={handleSubmit} style={{ width: "300px" }}>
                <div className="">
                    <label htmlFor="inputPassword4" className="form-label fs-5">Nueva contraseña</label>
                    <input type="password" className="form-control fs-5" id="inputPassword4" placeholder="Ingrese su nueva contraseña" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                {/*<div className="mt-2">
                    <label htmlFor="repeatinputPassword4" className="form-label fs-5">Repita la contraseña</label>
                    <input type="password" className="form-control fs-5" id="repeatinputPassword4" placeholder="Repita su nueva contraseña" value={password} onChange={(e) => setPassword(e.target.value)} required/>
                </div>*/}
                <button type="submit" className='btn btn-primary fs-5 mt-5' style={{ width: "300px" }}>Restablecer</button>
            </form>
            {message && <p className={`p-3 text-white mt-4 fs-5 ${estilos}`}>{message}</p>}
            {message && <Link to="/login" className="mt-3 fs-5">Volver al login</Link>}
        </div>
    );
};

export default ResetPassword;
