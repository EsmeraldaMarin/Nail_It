import { useNavigate } from 'react-router-dom';

function Logout() {
    const navigate = useNavigate()

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('auth');
        // Redirigir o realizar alguna acción después del cierre de sesión
        navigate('/login')
    };

    return (
        <button onClick={handleLogout}><i className="bi bi-box-arrow-left"></i>Cerrar Sesión</button>
    );
}

export default Logout;
