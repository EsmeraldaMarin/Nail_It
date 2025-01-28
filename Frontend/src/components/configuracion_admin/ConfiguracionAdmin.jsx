import React, { useEffect, useState } from "react";
import "./ConfiguracionAdmin.scss";
import axios from '../../axiosConfig/axiosConfig';

const ConfiguracionAdmin = () => {
    const [formData, setFormData] = useState({
        cbu: "",
        cvu: "",
        alias: "",
        titular_cuenta: "",
        horario_apertura: "",
        horario_cierre: "",
    });

    const [editableField, setEditableField] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [currentField, setCurrentField] = useState("");
    const [tempValue, setTempValue] = useState("");

    useEffect(() => {
        const fetchVariablesGlobales = async () => {
            try {
                const response = await axios.get(`/variablesGlobales`);
                setFormData(response.data[0]);
            } catch (error) {
                console.error('Error al obtener las Variables Globales', error);
            }
        };
        fetchVariablesGlobales();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleModifyClick = (field) => {
        setEditableField(field === editableField ? "" : field);
        if (field !== editableField) {
            setTempValue(formData[field]);
            setCurrentField(field);
        }
    };

    const handleSaveClick = () => {
        setShowModal(true); // Mostrar el modal al hacer clic en "Guardar"
    };

    const handleConfirmSave = async () => {
        try {
            console.log({ [currentField]: tempValue })
            //  AQUI ANDA MAL

            await axios.put(`/variablesGlobales/1`, { [currentField]: tempValue });
            setFormData((prev) => ({ ...prev, [currentField]: tempValue }));
            setEditableField(""); // Bloquear edición después de guardar
            setShowModal(false); // Cerrar el modal
        } catch (error) {
            console.error("Error al guardar los cambios:", error);
        }
    };

    const handleCancelSave = () => {
        setShowModal(false);
    };

    return (
        <div className="configuracion-ctn">
            <div className="configuracion-section">
                <h3>Configuración de Oh My Nails</h3>
                <p className="text-danger fs-5 fw-bold">
                    <i className="bi bi-exclamation-triangle me-2"></i>
                    Advertencia: Los datos de esta sección son sensibles, revise cuidadosamente antes de realizar un cambio.
                </p>
                <form className="">
                    <p className="my-3 fw-bold fs-5">Datos de cuenta bancaria</p>
                    {["titular_cuenta", "alias", "cbu", "cvu"].map((field, index) => (
                        <div className="row mb-3" key={index}>
                            <div className="col">
                                <label>{field.charAt(0).toUpperCase() + field.slice(1).replace("_", " ")}</label>
                                <div className="d-flex">
                                    <input
                                        type="text"
                                        name={field}
                                        className="form-control"
                                        value={formData[field]}
                                        onChange={handleInputChange}
                                        disabled={editableField !== field}
                                    />
                                    <button
                                        type="button"
                                        className={`${editableField === field ? "btn-danger" : "btn-warning"} btn ms-3`}
                                        onClick={() =>
                                            editableField === field ? handleSaveClick() : handleModifyClick(field)
                                        }
                                    >
                                        {editableField === field ? "Guardar" : "Modificar"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                    <p className="mt-4 mb-3 fw-bold fs-5">Horarios de atención del local</p>
                    <div className="d-flex flex-wrap mb-3">
                        {["horario_apertura", "horario_cierre"].map((field, index) => (
                            <div className="me-5" key={index}>
                                <label>{field.charAt(0).toUpperCase() + field.slice(1).replace("_", " ")}</label>
                                <div className="d-flex">
                                    <input
                                        type="time"
                                        name={field}
                                        className="form-control"
                                        value={formData[field]}
                                        onChange={handleInputChange}
                                        disabled={editableField !== field}
                                    />
                                    <button
                                        type="button"
                                        className={`${editableField === field ? "btn-danger" : "btn-warning"} btn mx-3`}
                                        onClick={() =>
                                            editableField === field ? handleSaveClick() : handleModifyClick(field)
                                        }
                                    >
                                        {editableField === field ? "Guardar" : "Modificar"}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </form>

            </div>

            <div className={`modal ${showModal ? 'active' : ''}`}>
                <div className="modal-content">
                    <p>¿Estás seguro de que deseas guardar los cambios?</p>
                    <button className="btn btn-success" onClick={handleConfirmSave}>
                        Confirmar
                    </button>
                    <button className="btn btn-danger" onClick={handleCancelSave}>
                        Cancelar
                    </button>
                </div>
            </div>

        </div>
    );
};

export default ConfiguracionAdmin;
