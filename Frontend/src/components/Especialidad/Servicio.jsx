import "../reserva_admin/Reservas.scss"
import React, { useState, useEffect } from 'react';
import axios from '../../axiosConfig/axiosConfig';
import ConsultaServicios from "./Consulta";
import RegistrarServicio from "./Registro";

const Servicio = () => {
    const [servicios, setServicios] = useState([]);
    const [action, setAction] = useState('C')
    const [item, setItem] = useState({})


    useEffect(() => {
        const fetchServicios = async () => {
            try {
                const response = await axios.get('/servicio');
                setServicios(response.data);
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
                    <>
                         <ConsultaServicios servicios={servicios} onActualizar={onActualizar} ></ConsultaServicios>
                    </>
                ) 
            }
            {
                action !== 'C' && (
                    <>
                      <RegistrarServicio onCancelar={onCancelar} item = {item} actualizado={actualizado}/>
                    </>
                )
            }
        </>
    )
}
export default Servicio