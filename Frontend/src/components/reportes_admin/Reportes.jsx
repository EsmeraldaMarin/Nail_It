import axios from "../../axiosConfig/axiosConfig";
import React, { useState, useEffect } from "react";
import CardReporteReserva from "./Cards/CardReporteReserva";
import './Reportes.scss'
import CardReporteReservasPendientes from "./Cards/CardReservasPendientes";
import CardsVariasCtn from "./Cards/CardsVariasCtn";
import TablaVerLista from "./TablaVerLista";
import { format } from 'date-fns';
import { es } from 'date-fns/locale';


const Reportes = () => {
    const [especialidades, setEspecialidades] = useState([])
    const [servicios, setServicios] = useState([])
    const [operadoras, setOperadoras] = useState([])
    const [reservasPendientes, setReservasPendientes] = useState([])
    const [reservasPorReembolsar, setReservasPorReembolsar] = useState([])
    const [reservasCanceladas, setReservasCanceladas] = useState([])
    const [reservasNoRealizada, setReservasNoRealizada] = useState([])
    const [reservasRealizada, setReservasRealizada] = useState([])
    const [modoVerLista, setModoVerLista] = useState(false)
    const [columnasTabla, setColumnasTabla] = useState([])
    const [dataTabla, setDataTabla] = useState([])

    useEffect(() => {
        const fetchDatos = async () => {
            try {
                const especialidadesResponse = await axios.get('/especialidad');
                const serviciosResponse = await axios.get('/servicio');
                const operadorasResponse = await axios.get('/admin');
                const todasLasReservas = await axios.get('/reserva');
                setReservasPendientes(todasLasReservas.data.filter(reserva => reserva.estado === "pendiente"))
                setReservasPorReembolsar(todasLasReservas.data.filter(reserva => reserva.estado === "por_reembolsar"))
                setReservasCanceladas(todasLasReservas.data.filter(reserva => reserva.estado === "cancelada"))
                setReservasNoRealizada(todasLasReservas.data.filter(reserva => reserva.estado === "no_realizada"))
                setReservasRealizada(todasLasReservas.data.filter(reserva => reserva.estado === "realizada"))
                setEspecialidades(especialidadesResponse.data);
                setServicios(serviciosResponse.data);
                setOperadoras(operadorasResponse.data);
            } catch (error) {
                console.error('Error al obtener los datos', error);
            }
        }
        fetchDatos()
    }, [])

    const formatearFecha = (fecha) => {
        const fechaLocal = new Date(new Date(fecha).getTime() + new Date().getTimezoneOffset() * 60000);
        return format(fechaLocal, 'dd/MM/yy', { locale: es });
    };

    const fetchReservasConFiltro = async (tipoReserva) => {
        const response = await axios.get(`/reserva?estado=${tipoReserva}`)
        return response.data
    }
    const formatPrice = (price) => {
        if (typeof price === "string") {
            price = parseFloat(price.replace(",", "."));
        }
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(price);
    };

    const handleClickVerLista = async (tipoReserva) => {
        setColumnasTabla([
            { accessorKey: "numero", header: "N°", enableSorting: true, enableColumnFilter: true },
            { accessorKey: "nombre", header: "Nombre Cliente", enableSorting: true, enableColumnFilter: true },
            { accessorKey: "contacto", header: "Contacto", enableSorting: false, enableColumnFilter: false },
            { accessorKey: "operadora", header: "Operadora", enableSorting: true, enableColumnFilter: true },
            { accessorKey: "servicio", header: "Servicio", enableSorting: true, enableColumnFilter: true },
            { accessorKey: "especialidad", header: "Especialidad", enableSorting: true, enableColumnFilter: true },
            { accessorKey: "fechaTurno", header: "Fecha Turno", enableSorting: true, enableColumnFilter: true },
            { accessorKey: "horaTurno", header: "Hora Turno", enableSorting: true, enableColumnFilter: true },
            { accessorKey: "montoSenia", header: "Importe Seña", enableSorting: true, enableColumnFilter: true },
            { accessorKey: "montoTotal", header: "Importe Total", enableSorting: true, enableColumnFilter: true },
            { accessorKey: "estado", header: "Estado", enableSorting: false, enableColumnFilter: false },
        ])
        let dataObtenida = await fetchReservasConFiltro(tipoReserva);

        //esto cambia el formato en el que se trae la info del back lista para insertar en la tabla
        dataObtenida = dataObtenida.map((r, index) => (
            {
                numero: index + 1,
                nombre: `${r.Cliente ? r.Cliente.nombre + " " + r.Cliente.apellido : r.nombre_cliente + " " + r.apellido_cliente}`,
                contacto: `${r.Cliente ? r.Cliente.numero : r.telefono_cliente}`,
                servicio: r.Servicio.nombre,
                especialidad: r.Servicio.Especialidad.nombre,
                fechaTurno: formatearFecha(r.fecha),
                horaTurno: r.horaInicio,
                montoSenia: formatPrice(r.montoSenia),
                montoTotal: formatPrice(r.montoTotal),
                operadora: r.Admin.nombre + " " + r.Admin.apellido,
                estado: (r.estado).replace("_", " ")
            }
        ))
        setDataTabla(dataObtenida)
        setModoVerLista(tipoReserva)
    }

    return (
        <div className="reportes">
            <div className="cards-ctn d-flex flex-wrap justify-content-evenly">
                <CardReporteReservasPendientes index={'1'} cantReservasAConfirmar={reservasPendientes.length} cantReservasAReembolsar={reservasPorReembolsar.length} />
                <CardReporteReserva index={'2'} cantidadReservas={reservasRealizada.length} tipoReserva={'realizada'} handleClickVerLista={handleClickVerLista} handleChangePeriodo={() => { }} />
                <CardReporteReserva index={'3'} cantidadReservas={reservasNoRealizada.length} tipoReserva={'no_realizada'} handleClickVerLista={handleClickVerLista} handleChangePeriodo={() => { }} />
                <CardReporteReserva index={'4'} cantidadReservas={reservasCanceladas.length} tipoReserva={'cancelada'} handleClickVerLista={handleClickVerLista} handleChangePeriodo={() => { }} />
            </div>
            <div className="table-ctn">
                {(operadoras && !modoVerLista) && <CardsVariasCtn
                    especialidades={especialidades}
                    servicios={servicios}
                    operadoras={operadoras}></CardsVariasCtn>}
                {modoVerLista &&
                    <div className="d-flex justify-content-between">
                        <p className="text-capitalize fw-bold fs-4">Reservas {modoVerLista.replace("_", " ")}s</p>
                        <button className="btn btn-secondary p-2" style={{ height: "fit-content" }} onClick={() => setModoVerLista(false)} >Cerrar</button>
                    </div>
                }
                {modoVerLista &&
                    <TablaVerLista columns={columnasTabla} data={dataTabla}></TablaVerLista>
                }
            </div>
        </div>
    )
};

export default Reportes;