import React from 'react';

const WhatsAppButton = ({telefono, mensaje, accion}) => {

    const handleClick = () => {
        // Codifica el mensaje para asegurar de que los espacios y caracteres especiales se manejen correctamente
        const encodedMessage = encodeURIComponent(mensaje);
        // Redirige a WhatsApp Web con el mensaje predeterminado
        window.open(`https://wa.me/${telefono}?text=${encodedMessage}`, '_blank');
    };

    return (
        <button onClick={handleClick} className='btn btn-success'>
            <i className="bi bi-whatsapp" style={{color:"#fff"}}></i>
            Enviar {accion}
        </button>
    );
};

export default WhatsAppButton;
