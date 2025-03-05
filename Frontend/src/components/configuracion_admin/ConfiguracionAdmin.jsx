import React, { useEffect, useState } from "react";
import "./ConfiguracionAdmin.scss";
import axios from '../../axiosConfig/axiosConfig';
import { preciosFormatter } from "../componentesDeFormato/PreciosFormatter";

const ConfiguracionAdmin = () => {
    const [formData, setFormData] = useState({
        cbu: "",
        cvu: "",
        alias: "",
        titular_cuenta: "",
        horario_apertura: "",
        horario_cierre: "",
        importe_seña: "",
        cuil: ""
    });

    const [editableField, setEditableField] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [currentField, setCurrentField] = useState("");
    const [tempValue, setTempValue] = useState("");
    const [mensajeError, setMensajeError] = useState("")

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
        setMensajeError("")
    };

    const handleModifyClick = (field) => {
        setEditableField(field === editableField ? "" : field);

        //en este punto, editable field tiene siemrpe el valor anterior y no el que se seteo arriba
        if (field !== editableField) {
            //esto permite poner en una variable temporal el valor del campo por si el usuario cancela
            setTempValue(formData[field]);
            //esto permite definir cual es el campo que se esta editando.
            setCurrentField(field);
        }
    };

    const handleSaveClick = () => {
        if (currentField === "horario_apertura") {
            const desde = convertirHoraANumero(formData[currentField]);
            const hasta = convertirHoraANumero(formData["horario_cierre"]);
            if (desde > hasta) {
                setMensajeError("El horario de apertura debe ser anterior al de cierre.")
                return
            }
        } else if (currentField === "horario_cierre") {
            const desde = convertirHoraANumero(formData["horario_apertura"]);
            const hasta = convertirHoraANumero(formData[currentField]);
            if (desde > hasta) {
                setMensajeError("El horario de apertura debe ser anterior al de cierre.")
                return
            }
        } else if (currentField === "importe_seña") {
            const cumpleFormato = preciosFormatter(formData[currentField], setMensajeError)
            if (!cumpleFormato) return
        }
        setShowModal(true); // Mostrar el modal al hacer clic en "Guardar"
    };
    const convertirHoraANumero = (hora) => {
        const [horas, minutos] = hora.split(":").map(Number);
        return horas + minutos / 60;
    };

    const handleConfirmSave = async () => {
        try {
            const response = await axios.put(`/variablesGlobales/1`, { [currentField]: formData[currentField] });
            setFormData((prev) => ({ ...prev, [currentField]: formData[currentField] }));
            setEditableField(""); // Bloquear edición después de guardar
            setShowModal(false); // Cerrar el modal
        } catch (error) {
            console.error("Error al guardar los cambios:", error);
        }
    };

    const handleCancelSave = () => {
        //pone el valor anterior otra vez
        setFormData((prev) => ({ ...prev, [currentField]: tempValue }));
        setEditableField(""); // Bloquear edición después de cancelar
        setShowModal(false);
    };

    return (
        <div className="configuracion-ctn">
            <div className={mensajeError.length > 0 ? 'configuracion-section bg-danger bg-opacity-10' : 'configuracion-section'}>
                <h3>Configuración de Oh My Nails</h3>
                {mensajeError.length == 0 ? <p className="text-danger fs-5 fw-bold">
                    <i className="bi bi-exclamation-triangle me-2"></i>
                    Advertencia: Los datos de esta sección son sensibles, revise cuidadosamente antes de realizar un cambio.
                </p> :
                    <div class="alert alert-danger fs-5" role="alert">
                        {mensajeError}
                    </div>}
                <form className="">
                    <p className="my-3 fw-bold fs-5">Datos de cuenta bancaria</p>
                    <div className="d-flex flex-wrap mb-3 justify-content-between" >
                        {["titular_cuenta", "cuil", "cbu", "cvu", "alias"].map((field, index) => (
                            <div style={{ minWidth: "49%" }} key={index}>
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
                        ))}
                    </div>
                    <p className="mt-4 mb-3 fw-bold fs-5">Importe mínimo de seña</p>
                    <div style={{ minWidth: "49%", maxWidth: "350px" }}>
                        <label>Importe de seña</label>
                        <div className="d-flex input-group">
                            <span className="input-group-text">$</span>
                            <input
                                type="text"
                                name="importe_seña"
                                className="form-control"
                                value={formData["importe_seña"]}
                                onChange={handleInputChange}
                                disabled={editableField !== "importe_seña"}
                                aria-label="Amount (to the nearest dollar)"
                            />
                            <span className="input-group-text">,00</span>
                            <button
                                type="button"
                                className={`${editableField === "importe_seña" ? "btn-danger" : "btn-warning"} btn mx-3`}
                                onClick={() =>
                                    editableField === "importe_seña" ? handleSaveClick() : handleModifyClick("importe_seña")
                                }
                            >
                                {editableField === "importe_seña" ? "Guardar" : "Modificar"}
                            </button>
                        </div>
                    </div>

                    <p className="mt-4 mb-3 fw-bold fs-5">Horarios de atención del local</p>
                    <div className="d-flex flex-wrap mb-3 justify-content-between">
                        {["horario_apertura", "horario_cierre"].map((field, index) => (
                            <div style={{ minWidth: "49%" }} key={index}>
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
