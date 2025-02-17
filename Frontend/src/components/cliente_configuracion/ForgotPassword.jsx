import { useState } from 'react';
import axios from '../../axiosConfig/axiosConfig';
import { Link } from 'react-router-dom';
const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [estilos, setEstilos] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setEstilos('bg-secondary');
            setMessage("Enviando mail. Aguarde...");
            const response = await axios.post('/auth/forgot-password', { email });
            setEstilos('bg-success')
            setMessage(response.data.message);
        } catch (error) {
            setEstilos('bg-danger')
            setMessage(error.response?.data?.message || "Error al enviar el correo");
        }
    };

    return (
        <div className='d-flex flex-column align-items-center'>
            <div style={{ height: "60px", boxShadow: "0 0 5px #bbb", width: "100vw" }}></div>
            <img className="my-5" src="/img/logo_nailit.png" alt="logo nail it" style={{ width: "200px" }} />
            <h2>Recuperar Contraseña</h2>
            <form className="row g-3 mt-3" onSubmit={handleSubmit}>
                <div className='m-0 p-0'>
                    <label htmlFor="inputEmail4" className="form-label fs-4">Ingrese su email</label>
                    <input type="email" className="form-control fs-4" id="inputEmail4" placeholder="Correo electrónico" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <button type="submit" className='btn btn-primary fs-4' disabled={estilos==="bg-secondary"}>Enviar</button>
            </form>
            {message && <p className={`p-3 text-white mt-4 fs-5 ${estilos}`}>{message}</p>}
            <Link to="/login" className="mt-3 fs-5">Volver al login</Link>
        </div>
    );
};

export default ForgotPassword;
