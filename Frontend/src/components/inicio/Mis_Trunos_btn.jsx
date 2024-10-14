import { useNavigate } from 'react-router-dom';

const mis_turnos = () => {
    const navigate = useNavigate()
    const handleRedirect = () => {
       
        navigate('/historial')
    };
    return (
        <button className='btn btn-secondary misTurnos-btn' onClick={handleRedirect}>Mis turnos</button>
    );

}

export default mis_turnos