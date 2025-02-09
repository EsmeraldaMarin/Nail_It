import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const FechaConFormato = ({ value }) => {
    const formatearFecha = (fecha) => {
        const fechaLocal = new Date(new Date(fecha).getTime() + new Date().getTimezoneOffset() * 60000);
        return format(fechaLocal, 'EEEE dd/MM', { locale: es });
    };

    return (
        <p>{formatearFecha(value)}</p>
    );
};

export default FechaConFormato;
