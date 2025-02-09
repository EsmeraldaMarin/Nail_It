import React, { useEffect, useState } from 'react';
import './CardInfoReserva.scss';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import axios from '../../../axiosConfig/axiosConfig'

const CardInfoReserva = ({ esDeEstilista, setPasoActual, reservaData, setReservaData, registrarReserva }) => {
    const { profesional_data, fecha, servicio_data, tipoServicio, horario, precio, monto } = reservaData;

    const [viaComprobante, setViaComprobante] = useState('')
    const [elegirOtroImporte, setElegirOtroImporte] = useState(false)
    const [alias, setalias] = useState('')
    const [cbu, setcbu] = useState('')
    const [titular_cuenta, settitular_cuenta] = useState('')
    const [importe_seña, setimporte_seña] = useState('')
    const [subiendoArchivo, setSubiendoArchivo] = useState(false)

    useEffect(() => {
        const fetchVariablesGlobales = async () => {
            try {
                const response = await axios.get('/variablesGlobales');
                setalias(response.data[0].alias)
                setimporte_seña(parseInt(response.data[0].importe_seña))
                settitular_cuenta(response.data[0].titular_cuenta)
                setcbu(response.data[0].cbu)

            } catch (error) {
                console.error('Error al obtener el importe de senia', error);
            }
        }
        fetchVariablesGlobales()
    }, [])

    const handleFileChange = async (event) => {
        const selectedFile = event.target.files[0];

        if (!selectedFile) return;

        const formData = new FormData();
        formData.append("file", selectedFile);
        formData.append("upload_preset", "nailit"); // Reemplaza con tu preset

        try {
            setSubiendoArchivo(true)
            const fileType = selectedFile.type;
            const allowedTypes = ["image/png", "image/jpeg", "image/gif", "application/pdf"];
            if (!allowedTypes.includes(fileType)) {
                alert("Tipo de archivo no soportado. Solo se permiten imágenes (PNG, JPEG, GIF) y PDFs.");
                setSubiendoArchivo(false);
                return;
            }
            const resourceType = fileType === "application/pdf" ? "raw" : "auto";
            console.log(resourceType)
            formData.append("resource_type", resourceType);
            for (const [key, value] of formData.entries()) {
                console.log(key, value);
            }
            const response = await fetch("https://api.cloudinary.com/v1_1/dnmfolf5m/upload", {
                method: "POST",
                body: formData,
            });
            const data = await response.json();
            console.log(data)
            console.log("Archivo subido a Cloudinary:", data.secure_url);

            setReservaData({
                ...reservaData,
                comprobante: data.secure_url, // Guardamos la URL del comprobante
            });
            setSubiendoArchivo(false)

        } catch (error) {
            console.error("Error al subir el archivo:", error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setReservaData({
            ...reservaData,
            userId: {
                ...reservaData.userId,
                [name]: value
            }
        });
    }
    const handleConfirm = () => {
        registrarReserva();
        setPasoActual(3);
    };
    const formatearFecha = (fecha) => {
        const fechaLocal = new Date(new Date(fecha).getTime() + new Date().getTimezoneOffset() * 60000);
        return format(fechaLocal, 'EEEE dd/MM', { locale: es });
    };
    const handleGuardarMontoSenia = () => {
        const input = document.getElementById("montoSenia");
        const inputValue = parseFloat(input.value);
        if (inputValue < importe_seña || inputValue > reservaData.servicio_data.precio) {
            input.classList.add("danger")
            return
        }
        input.classList.remove("danger")
        setReservaData({ ...reservaData, montoSenia: inputValue });
        setElegirOtroImporte(false);
    };
    const formatPrice = (price) => {
        if (typeof price === "string") price = parseFloat(price)
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS',
        }).format(price);
    };

    return (
        <div className="container">
            <h5 className="mb-4 title">Confirma los datos de tu reserva</h5>

            <div className="card shadow-sm p-4 mb-4 info-ctn">
                <div className="d-flex justify-content-between align-items-center border-bottom pb-3 mb-3">
                    <button className="btn border-black border-2 fw-bolder fs-3 rounded-circle d-flex align-items-center justify-content-center"
                        style={{ width: "30px", height: "30px" }}
                        onClick={() => setPasoActual(1)}>
                        {`<`}
                    </button>
                    <p className="mb-0 ms-3">
                        Reserva para: <span className="fw-bold servicio">{servicio_data.nombre}</span>
                    </p>
                </div>

                <div className="mb-3">
                    <div className="d-flex justify-content-between">
                        <p className="fw-bold mb-0">Profesional</p>
                        <p className="text-end mb-0">{profesional_data.nombre} {profesional_data.apellido}</p>
                    </div>
                    <div className="d-flex justify-content-between">
                        <p className="fw-bold mb-0">Fecha</p>
                        <p className="text-end mb-0 text-capitalize">{formatearFecha(fecha)}</p>
                    </div>
                    <div className="d-flex justify-content-between">
                        <p className="fw-bold mb-0">Horario</p>
                        <p className="text-end mb-0">{horario} hs</p>
                    </div>
                </div>

                <div style={{ height: "100px" }}>
                    {
                        elegirOtroImporte ?
                            <div className='text-end'>
                                <label htmlFor="montoSenia">Ingrese el importe que desea transferir:</label>
                                <div className="input-group mb-1 d-flex align-items-center" style={{ paddingLeft: "20%" }}>
                                    <span className="input-group-text">$</span>
                                    <input type="text" className="form-control fw-bold" id="montoSenia" aria-label="Amount (to the nearest dollar)" />
                                    <button className='ok-montoSenia' onClick={handleGuardarMontoSenia}><i className="bi bi-check"></i></button>
                                </div>
                                <span className='text-end text-danger texto-advertencia' style={{ fontSize: "12px" }}><i className='bi bi-exclamation-circle me-2'></i>El importe ser mayor a {importe_seña} y menor a {reservaData.servicio_data.precio}</span>
                            </div>
                            :
                            <div className=' text-end'>
                                <p className="fw-bold mb-1">Importe de seña a transferir</p>
                                <p className="fs-1 fw-bold">{formatPrice(reservaData.montoSenia)}</p>
                            </div>
                    }
                </div>

                <div className='d-flex justify-content-end'>
                    {elegirOtroImporte ?
                        <p className='text-decoration-underline mt-3 text-end mb-3' style={{ cursor: "pointer", color: "#0101c2", width: "fit-content" }}
                            onClick={() => setElegirOtroImporte(false)}>Señar el mínimo</p>
                        :
                        <p className='text-decoration-underline mt-3 text-end mb-3' style={{ cursor: "pointer", color: "#0101c2", width: "fit-content" }}
                            onClick={() => setElegirOtroImporte(true)}>Señar otro importe</p>
                    }
                </div>

                <button
                    className="btn btn-success w-100 mb-3"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapseExample"
                    aria-expanded="false"
                    aria-controls="collapseExample"
                >Ver datos para pago de seña</button>

                <div className="collapse" id="collapseExample">
                    <div className="card card-body">
                        <div className="text-center">
                            <p className='text-decoration-underline'>Alias para Transferencia</p>
                            <strong className="d-block mb-2 fs-5">{alias}</strong>
                            <p className='text-decoration-underline'>CBU para Transferencia</p>
                            <strong className="d-block mb-2 fs-5">{cbu}</strong>
                            <p className='text-decoration-underline'>Titular de Cuenta</p>
                            <strong className="d-block fs-5">{titular_cuenta}</strong>

                        </div>
                    </div>
                </div>

                {!esDeEstilista &&
                    <div className='my-4'>
                        <p className='mb-3'>¿Cómo desea enviar su comprobante?</p>
                        <div className="form-check mb-3">
                            <input onChange={(e) => setViaComprobante(e.target.value)} className="form-check-input" type="radio" value="wpp" name="flexRadioDefault" id="flexRadioDefault1" />
                            <label className="form-check-label" htmlFor="flexRadioDefault1">
                                Enviar por Whatsapp
                            </label>
                        </div>
                        <div className="form-check">
                            <input onChange={(e) => setViaComprobante(e.target.value)} className="form-check-input" type="radio" value="nailit" name="flexRadioDefault" id="flexRadioDefault12" />
                            <label className="form-check-label" htmlFor="flexRadioDefault12">
                                Adjuntar Aquí
                            </label>
                        </div>
                        {viaComprobante == 'nailit' &&
                            <div className='mt-4'>
                                <label htmlFor="formFile" className="form-label">Adjunte su comprobante</label>
                                <input className="form-control" type="file" id="formFile" onChange={handleFileChange} />
                            </div>
                        }
                    </div>
                }
                {
                    esDeEstilista &&
                    <div className='my-3'>
                        <div className="form-group col-md-6">
                            <label className="form-label">Nombre</label>
                            <input
                                type="text"
                                name="nombre_cliente"
                                className="form-control"
                                value={reservaData.userId.nombre_cliente}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group col-md-6">
                            <label className="form-label">Apellido</label>
                            <input
                                type="text"
                                name="apellido_cliente"
                                className="form-control"
                                value={reservaData.userId.apellido_cliente}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group col-md-6">
                            <label className="form-label" >Número de teléfono</label>
                            <input
                                type="tel"
                                name="telefono_cliente"
                                className="form-control"
                                value={reservaData.userId.telefono_cliente}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>
                }
                {
                    viaComprobante === 'wpp' ?
                        <a
                            href={`https://wa.me/3571315193`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`btn w-100 btn-success`}
                            onClick={handleConfirm}
                            style={{ color: "#fff", textDecoration: "none" }}
                        >
                            Ir a Whatsapp
                            <i className={`ms-3 bi bi-whatsapp`}></i>
                        </a>
                        :
                        <button
                            onClick={handleConfirm}
                            className={`btn w-100 btn-primary`}
                            disabled={(!reservaData.comprobante && !esDeEstilista && viaComprobante !== 'wpp') || subiendoArchivo}
                        >
                            {subiendoArchivo && <i className='bi bi-arrow-repeat'></i>}
                            {!subiendoArchivo && "Listo"}
                            {!subiendoArchivo && <i className={`ms-3 bi bi-check`}></i>}
                        </button>
                }

            </div>

            {/* <span className="text-muted">* Mensaje de confirmación aparecerá aquí</span> */}
        </div >
    );
};

export default CardInfoReserva;
