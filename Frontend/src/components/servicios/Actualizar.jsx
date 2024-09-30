import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import services from "../../services/servicios.services";
import Login from "../login/Login";

export default function Actualizar() {
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm();

    const [updateError, setUpdateError] = useState(""); // va a ser true si la API me dio error

    const { ID, planId } = useParams();
    console.log("id capturado: ", ID);

    // cada vez que cambie el parametro de la url, ejecuta este efecto
    useEffect(() => {
        const getUser = async () => {
            try {
                const data = await services.getById(ID);
                // setea cada uno de los campos con la informacion traida
                setValue("Nombre", data.Nombre);
                setValue("Precio", data.Precio);
                setValue("FechaRegistro", data.FechaRegistro);
                setValue("Descripcion", data.Descripcion);
            } catch (error) {
                console.error("Error al obtener los datos: ", error);
                navigate("/error");
            }
        };
        getUser();
    }, [ID, setValue]);

    const navigate = useNavigate();

    const onSubmit = async (data) => {
        const response = await services.update(ID, data);
        console.log("respuesta en put: ", response);
        if (response.error) {
            setUpdateError(response.error); // "no se puedo crear el usuario"
            return;
        }
        navigate(`/servicios/${planId}`); // cambiar a useState
    };

    const cancelar = () => {
        navigate(-1);
    };

    return (
        <div className="bg-gral">
            <Login />
            <div className="container_gral">
                <form className="form_gral" id="putForm" onSubmit={handleSubmit(onSubmit)}>
                    <h3>Actualizacion de Servicios</h3>
                    <div className="form-group">
                        <label htmlFor="Nombre" className="form-label"> Nombre del servicio:</label>
                        <input type="text" className="form-control" id="Nombre" {...register("Nombre", { required: "Este campo es requerido" })} />
                        {errors.Nombre && (<span className="text-danger">{errors.Nombre.message}</span>)}
                    </div>

                    <div className="form-group">
                        <label htmlFor="Descripcion" className="form-label"> Descripcion:</label>
                        <input type="text" className="form-control" id="Descripcion" {...register("Descripcion", { required: "Este campo es requerido" })} />
                        {errors.Descripcion && (<span className="text-danger">{errors.Descripcion.message}</span>)}
                    </div>

                    <div className="form-group">
                        <label htmlFor="Precio" className="form-label"> Precio: </label>
                        <input type="number" className="form-control" id="Precio" {...register("Precio", { required: "Este campo es requerido" })} />
                        {errors.Precio && (<span className="text-danger">{errors.Precio.message}</span>)}
                    </div>
                    
                    {updateError && <p>{updateError}</p>}
                    <button type="submit" className="btn btn-primary mx-1 mt-2">
                        Actualizar
                    </button>
                    <button type="button" className="btn btn-secondary mx-1 mt-2" onClick={cancelar}>
                        Cancelar
                    </button>
                </form>
            </div>
        </div>
    );
}