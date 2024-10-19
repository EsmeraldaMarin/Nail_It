
import React, { useState, useEffect } from 'react';
import {useForm} from 'react-hook-form' 
import axios from '../../axiosConfig/axiosConfig';



export default function RegistrarServicio({onGuardar, onCancelar, item, actualizado,  registrarEsp, especialidades}){
    const {register, handleSubmit, formState: {errors}, setValue} = useForm({values: item})

    

    useEffect(() => {
        
                if (item && item.id_especialidad) {
                    setValue('id_especialidad', item.id_especialidad);
                }
            } );


    const onSubmit = (data) => {
        if (item.id)
            actualizado(item.id,data) 
        else
            onGuardar(data)
    }
    const especialidades2 = especialidades





    
    return(
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <h5>{item.id !==undefined?'Actualizar Datos del servicio': 'Nuevo servicio'}</h5>
                <div className="form-group">
                    <label htmlFor="nombre">Nombre del servicio</label>
                    <input type="text" className="form-control" id="nombre" placeholder="Ingrese Nombre del servicio"
                    {...register('nombre', {required: 'Campo obligatorio'})} />
                    {errors.nombre && <span className="text-danger">{errors.nombre.message}</span>}
                </div>
                <div className="form-group">
                    <label htmlFor="precio">Precio del servicio</label>
                    <textarea type="number" className="form-control" id="precio" placeholder="Ingrese el precio (sin $)"
                    {...register('precio', {required: 'Campo obligatorio'})} />
                    {errors.precio && <span className="text-danger">{errors.precio.message}</span>}
                </div>
                <div className="form-group">
                    <label htmlFor="duracion">Duracion del servicio (en minutos) </label>
                    <textarea type="number" className="form-control" id="duracion" placeholder="Ingrese la duracion (en min)"
                    {...register('duracion', {required: 'Campo obligatorio'})} />
                    {errors.duracion && <span className="text-danger">{errors.duracion.message}</span>}
                </div>
                {/* Campo desplegable para especialidades */}
                <div className="form-group">
                    <label htmlFor="id_especialidad">Especialidad</label>
                    <select
                        className="form-control"
                        id="id_especialidad"
                        {...register('id_especialidad', { required: 'Debe seleccionar una especialidad' })}
                    >
                        <option value="">Seleccione una especialidad</option>
                        {especialidades2.map((especialidad) => (
                            <option key={especialidad.id} value={especialidad.id}>
                                {especialidad.nombre}
                            </option>
                        ))}
                    </select>
                    {errors.especialidad && <span className="text-danger">{errors.especialidad.message}</span>}
                </div>
                {item.id === undefined && (
                    <div className="form-group mt-2">
                        <button type="button" className="btn btn-link" onClick={registrarEsp}>
                            Agregar nueva especialidad
                        </button>
                    </div>
                )}
                <div className="form-group mt-3">
                    <button type="submit" className="btn btn-primary mx-1">Guardar</button>
                    <button type="button" onClick={onCancelar}  className="btn btn-secondary mx-1"> Cancelar</button>
                </div>
            </form>
        </>
        
    )}