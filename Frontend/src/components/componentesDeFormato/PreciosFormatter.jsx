const preciosFormatter = (input, setMensajeError) => {
    if (!input) return "";

    const valor =  input.toString()

    // No permitir números con separadores de miles
    if (/\d{1,3}(\.\d{3})+(,\d{1,2})?$/.test(valor) || /\d{1,3}(,\d{3})+(\.\d{1,2})?$/.test(valor)) {
        setMensajeError("Ingrese el valor sin separador de miles")
        return null;
    }

    // Reemplazar comas decimales por puntos
    let normalized = valor.replace(/,/g, ".");

    // Validar si es un número válido
    if (!/^\d+(\.\d{1,2})?$/.test(normalized)) {
        setMensajeError("Ingrese un valor numérico positivo")
        return null
    };

    let value = parseFloat(normalized);

    if (value >= 0) {
        return value
    } else {
        setMensajeError("Ingrese un valor positivo")
        return null
    }
};

const preciosFormatterSinMensajes = (input) => {
    if (!input) return "";

    const valor =  input.toString()

    // Reemplazar comas decimales por puntos
    let normalized = valor.replace(/,/g, ".");

    let value = parseFloat(normalized);
    return value
};


export { preciosFormatter, preciosFormatterSinMensajes };
