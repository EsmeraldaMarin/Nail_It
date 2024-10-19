import "../reserva_admin/Reservas.scss"
import React, { useState, useEffect } from 'react';
import axios from '../../axiosConfig/axiosConfig';
import ConsultaServicios from "./Consulta";
import RegistrarServicio from "./RegistrarServicio";
import RegistroEspecialidad from './RegistroEspecialidad';
import { Modal } from 'react-bootstrap'


const Servicio = () => {
    const [servicios, setServicios] = useState([]);
    const [action, setAction] = useState('C')
    const [item, setItem] = useState({})
    const [especialidades, setEspecialidades] = useState([]);
    const [showModal, setShowModal] = useState(false)


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

    const onActualizar = async(item)=>{
        setItem(item)
        setAction('A')
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
        if(result){
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
        if (result){
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
        console.log(data)
        const result = await axios.put(`/servicio/${id}`, {
            nombre: data.nombre,
            precio: parseFloat(data.precio), // Convertir a número
            duracion: parseInt(data.duracion, 10), // Convertir a número
            id_especialidad: parseInt(data.id_especialidad, 10)
        });
        if(result){
            const response = await axios.get('/servicio');
            setServicios(response.data);
            setAction('C')
            setItem({})
        }
    }

    return (
        <>
            {
                action === 'C' && (
                
                         <ConsultaServicios servicios={servicios} onNewClick={onNewClick} onActualizar={onActualizar} ></ConsultaServicios>
                
                ) 
            }
            {
                action !== 'C' && (
                
                      <RegistrarServicio onGuardar={onGuardar} onCancelar={onCancelar} item = {item} actualizado={actualizado} onGuardarEsp ={onGuardarEsp}  registrarEsp={registrarEsp} especialidades= {especialidades}/>
                      
            )}
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