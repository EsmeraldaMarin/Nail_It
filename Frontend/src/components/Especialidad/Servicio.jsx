import "../reserva_admin/Reservas.scss"
import React, { useState, useEffect } from 'react';
import axios from '../../axiosConfig/axiosConfig';
import ConsultaServicios from "./Consulta";
import RegistrarServicio from "./RegistrarServicio";
import RegistroEspecialidad from './RegistroEspecialidad';
import ModalServicio from './ModalServicio'
import { Modal } from 'react-bootstrap'

const Servicio = () => {
    const [servicios, setServicios] = useState([]);
    const [action, setAction] = useState('C')
    const [item, setItem] = useState({})
    const [especialidades, setEspecialidades] = useState([]);
    const [activar, setActivar] = useState(true);

    //modales
    const [showModal, setShowModal] = useState(false)
    const [showModalConfirmarOperacion, setShowModalConfirmarOperacion] = useState(false)
    const [showModalNoSePuedeEliminarServicio, setShowModalNoSePuedeEliminarServicio] = useState(false)
    const [tituloModal, setTituloModal] = useState("")
    const [cuerpoModal, setCuerpoModal] = useState("")
    const [botonIzqModal, setBotonIzqModal] = useState("")
    const [botonDerModal, setBotonDerModal] = useState("")

    useEffect(() => {
        const fetchServicios = async () => {
            try {
                const response = await axios.get('/servicio');
                setServicios(response.data);
                const response2 = await axios.get('/especialidad');
                setEspecialidades(response2.data);
            } catch (error) {
                console.error('Error al obtener los servicios', error);
            }
        };
        fetchServicios();
    }, []);

    const onNewClick = () => {
        setAction('N')
    }

    const onActualizar = async (item) => {
        setItem(item)
        setAction('A')
    }

    const onToggleActivo = async (item, estado_servicio) => {
        const accion = estado_servicio ? "Activar" : "Desactivar"
        setItem(item);
        //AQUI PUEDE SER TRUE O FALSE
        setActivar(estado_servicio);
        setTituloModal(`${accion} Servicio`);
        setCuerpoModal(`¿Está seguro que desea ${accion.toLowerCase()} el servicio de ${item.nombre.toUpperCase()}?`);
        setBotonIzqModal(`${accion} servicio`);
        setBotonDerModal("Cancelar acción");
        setShowModalConfirmarOperacion(true);
    }

    const onConfirmarOperacion = async () => {

        setShowModalConfirmarOperacion(false);

        const result = await axios.put(`/servicio/${item.id}/cambioEstado`, {
            esta_activo: activar
        })
        if (result) {
            const response = await axios.get('/servicio');
            setServicios(response.data);
            setAction('C')
        }

        if (!activar) {
            //mejora: hacer un endpoint para traer solo las reservas que correcpondan a ese servicio.
            const response = await axios.get('/reserva');
            const hayReservaDeEseServicio = response.data.some(r => r.Servicio.id === item.id)

            if (hayReservaDeEseServicio) {
                setTituloModal("Servicio desactivado");
                setCuerpoModal(`El servicio de ${item.nombre.toUpperCase()} se encuentra desactivado pero aún hay reservas activas de ese servicio.`);
                setBotonIzqModal("");
                setBotonDerModal("Entendido");
                setShowModalNoSePuedeEliminarServicio(true);
            }
        }

        setItem({})
    }

    const onCancelar = () => {
        setAction('C')
        setItem({})
    }

    const onGuardar = async (data) => {
        const result = await axios.post(`/servicio`, {
            nombre: data.nombre,
            precio: parseFloat(data.precio), // Convertir a número
            duracion: parseInt(data.duracion, 10), // Convertir a número
            id_especialidad: parseInt(data.id_especialidad, 10)
        });
        if (result) {
            const response = await axios.get('/servicio');
            setServicios(response.data);
            setAction('C')

        }
    }

    const onGuardarEsp = async (data) => {
        const result = await axios.post(`/especialidad`, {
            nombre: data.nombre,
            descripcion: data.descripcion
        });
        if (result) {
            setShowModal(false)
            const response2 = await axios.get('/especialidad');
            setEspecialidades(response2.data);
        }
    }


    const registrarEsp = () => {
        setShowModal(true);  // Mostrar el formulario de nueva especialidad
    };

    const onCancelarEsp = () => {
        setShowModal(false)
    }


    const actualizado = async (id, data) => {
        const result = await axios.put(`/servicio/${id}`, {
            nombre: data.nombre,
            precio: parseFloat(data.precio), // Convertir a número
            duracion: parseInt(data.duracion, 10), // Convertir a número
            id_especialidad: parseInt(data.id_especialidad, 10)
        });
        if (result) {
            const response = await axios.get('/servicio');
            setServicios(response.data);
            setAction('C')
            setItem({})
        }
    }

    return (
        <>
            {action === 'C' && <ConsultaServicios servicios={servicios} onNewClick={onNewClick} onActualizar={onActualizar} onToggleActivo={onToggleActivo}></ConsultaServicios>}
            {action !== 'C' && <RegistrarServicio onGuardar={onGuardar} onCancelar={onCancelar} item={item} actualizado={actualizado} onGuardarEsp={onGuardarEsp} registrarEsp={registrarEsp} especialidades={especialidades} />}
            {showModalConfirmarOperacion &&
                <ModalServicio
                    showModal={showModalConfirmarOperacion}
                    closeModal={() => {
                        setShowModalConfirmarOperacion(false)
                        setItem({})
                    }}
                    title={tituloModal} body={cuerpoModal} btnLeft={botonIzqModal} btnRight={botonDerModal} confirmOperation={onConfirmarOperacion}></ModalServicio >}
            {showModalNoSePuedeEliminarServicio &&
                <ModalServicio
                    showModal={showModalNoSePuedeEliminarServicio}
                    closeModal={() => {
                        setShowModalNoSePuedeEliminarServicio(false)
                        setItem({})
                    }}
                    title={tituloModal} body={cuerpoModal} btnLeft={botonIzqModal} btnRight={botonDerModal} confirmOperation={onConfirmarOperacion}></ModalServicio >}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Registrar Nueva Especialidad</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <RegistroEspecialidad onGuardarEsp={onGuardarEsp} onCancelarEsp={onCancelarEsp} />
                </Modal.Body>
            </Modal>

        </>
    )
}
export default Servicio