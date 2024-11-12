
import React, { useState, useEffect } from 'react';
const NotificacacionReservasPendientes = ({ tipoNoti }) => {

    const [mensaje, setMensaje] = useState("")
    if (tipoNoti == "reembolzo") {
        setMensaje("Tienes reembolzos pendientes")
    }else{
        setMensaje("Tienes reservas pendientes de confirmar")
    }
    return (
        <div class="toast" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="toast-body">
                {mensaje}
                <div class="mt-2 pt-2 border-top">
                    <button type="button" class="btn btn-primary btn-sm">Ir a reservas pendientes</button>
                    <button type="button" class="btn btn-secondary btn-sm" data-bs-dismiss="toast">Close</button>
                </div>
            </div>
        </div>
    )
}
export default NotificacacionReservasPendientes;