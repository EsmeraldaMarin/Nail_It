import React from 'react';
import "./CardInfoTransferencia.scss"

const CardInfoTransferencia = ({ setPasoActual, reservaData, setReservaData }) => {
    const { profesional, fecha, servicio, tipoServicio, horario, monto } = reservaData;
    //esto se hace con un fetch
    const alias = "hola.como.estas"
    const cbu = "0800056663332225"
    const titularCuenta = "Maria Jose Apellido"
    
    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0]; // Obtiene el archivo seleccionado
        setReservaData({
            ...reservaData,
            comprobante: selectedFile
        });
    };
    const handleConfirm = () => {

        // Lógica de confirmación de reserva aquí (opcional)
        // Luego de confirmar, redirige a otra vista
        if (reservaData.comprobante) {
            setPasoActual(4);
        }
    };
    return (
        <div className='container-fluid'>
            <h5>Realiza la seña</h5>

            <div className='info-ctn transf'>

                <div>
                    <button onClick={() => setPasoActual(2)}><i className='bi bi-chevron-left'></i></button>
                    <p>
                        Reserva para:
                        <span className='servicio'>{servicio}</span>
                    </p>
                </div>
                <div >
                    <p className="fecha">Reserva para el dia:   {fecha}</p>
                    <p className="horario">A las:   {horario} hs</p>
                    <p className='profesional'>El servicio sera realizado por:   {profesional}</p>
                </div>
                <div>

                    <p>Alias para Transferencia <span>{alias}</span></p>
                    <p>CBU para Transferencia <span>{cbu}</span></p>
                    <p>Titular de Cuenta <span>{titularCuenta}</span></p>
                    <div className='monto-ctn'>
                        <p>Monto de Seña:</p>
                        <p className="monto">${monto}</p>
                    </div>
                    <p className='fw-normal'>Suba su comprobante de transferencia:</p>
                    <input type="file" onChange={handleFileChange} />
                    <button onClick={handleConfirm} className="btn btn-primary mt-3 btn-continuar">
                        Adjuntar Comprobante
                        <i className='bi bi-file-earmark-arrow-up'></i>
                    </button>
                    <span>Mensaje</span>
                </div>
            </div>
        </div>
    );
};

export default CardInfoTransferencia;
