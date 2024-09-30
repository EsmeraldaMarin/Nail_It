import { useNavigate } from 'react-router-dom';

function Logout() {
    const navigate = useNavigate()

    const handleLogout = () => {
        localStorage.removeItem('token');
        // Redirigir o realizar alguna acción después del cierre de sesión
        console.log('Sesión cerrada');
        navigate('/login')
    };

    return (
        <button className='btn btn-secondary logout-btn' onClick={handleLogout}>Cerrar sesión</button>
    );
}

export default Logout;
