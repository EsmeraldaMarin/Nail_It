import twilio from 'twilio';

// Configuración de Twilio
const accountSid = '';
const authToken = '';
const client = twilio(accountSid, authToken);

// Función para notificar a la estilista
async function enviarNotificacion(telefono, mensaje) {
    try {
        const response = await client.messages.create({
            from: 'whatsapp:+14155238886', // Número de Twilio
            to: `whatsapp:+549${telefono}`,
            body: mensaje,
        });
        console.log('Mensaje enviado:', response.sid);
    } catch (error) {
        console.error('Error enviando notificación:', error);
        throw error;
    }
}

export default enviarNotificacion;

