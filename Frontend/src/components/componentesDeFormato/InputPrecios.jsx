import { useState, useEffect } from "react";

const InputPrecios = ({ value, onChange, disabled = false }) => {
    const [rawValue, setRawValue] = useState("");

    useEffect(() => {
        setRawValue(value ? value.toString() : ""); // Aseguramos que siempre sea un string
    }, [value]);

    const formatCurrency = (val) => {
        if (!val) return "";
        const number = parseFloat(val.replace(/[^0-9.]/g, "")) || 0;
        return new Intl.NumberFormat("es-AR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(number);
    };

    const handleInputChange = (e) => {
        let newValue = e.target.value.replace(/[^0-9.]/g, ""); // Solo números y punto decimal
        setRawValue(newValue);
        onChange(newValue); // Envía el valor limpio al estado padre
    };

    return (
        <div className="input-group">
            <span className="input-group-text">$</span>
            <input
                type="text"
                className="form-control"
                value={formatCurrency(rawValue)}
                onChange={handleInputChange}
                disabled={disabled}
                aria-label="Monto"
            />
        </div>
    );
};

export default InputPrecios;
