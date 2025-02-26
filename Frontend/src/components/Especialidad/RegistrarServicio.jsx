
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { preciosFormatter } from '../componentesDeFormato/PreciosFormatter';

export default function RegistrarServicio({ mensajeServicioExistente, onGuardar, onCancelar, item, actualizado, registrarEsp, especialidades }) {
    const { register, handleSubmit, formState: { errors }, setValue } = useForm({ values: item })
    const [mensajeErrorEnImporte, setMensajeErrorEnImporte] = useState("")
    console.log(mensajeServicioExistente)
    useEffect(() => {

        if (item && item.id_especialidad) {
            setValue('id_especialidad', item.id_especialidad);
        }
    });

    const onSubmit = (data) => {
        const importeConFormato = preciosFormatter(data.precio, setMensajeErrorEnImporte);
        //si no cumple con el formato no debe permitir seguir con la operacion
        if (!importeConFormato) return

        //se modifica el precio ingresado por teclado por el precio con formato adecuado 5555.5
        data.precio = importeConFormato;

        if (item.id)
            actualizado(item.id, data)
        else
            onGuardar(data)
    }
    const especialidades2 = especialidades

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <h5>{item.id !== undefined ? 'Actualizar Datos del servicio' : 'Nuevo servicio'}</h5>
                <div className="form-group">
                    <label htmlFor="nombre">Nombre del servicio</label>
                    <input type="text" className="form-control" id="nombre" placeholder="Ingrese Nombre del servicio"
                        {...register('nombre', { required: 'Campo obligatorio' })} />
                    {mensajeServicioExistente && <p className='text-danger'>{mensajeServicioExistente}</p>}
                    {errors.nombre && <span className="text-danger">{errors.nombre.message}</span>}
                </div>
                <div className="form-group">
                    <label htmlFor="precio">Precio del servicio</label>
                    <div className="input-group">
                        <span className="input-group-text">$</span>
                        <input
                            type="text"
                            className="form-control"
                            id="precio"
                            placeholder="Ingrese el precio (sin $)"
                            {...register("precio", {
                                required: "Campo obligatorio",
                                pattern: {
                                    value: /^[0-9]+$/, // Solo números enteros
                                    message: "El precio no debe tener decimales",
                                },
                                validate: (value) =>
                                    Number.isInteger(Number(value)) || "El precio debe ser un número entero",
                            })}
                        />
                        <span className="input-group-text">,00</span>
                    </div>
                    {mensajeErrorEnImporte && <p className="text-danger">{mensajeErrorEnImporte}</p>}
                    {errors.precio && <span className="text-danger">{errors.precio.message}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="duracion">Duración del servicio (en minutos)</label>
                    <input
                        type="number"
                        className="form-control"
                        id="duracion"
                        placeholder="Ingrese la duración (en min)"
                        {...register('duracion', {
                            required: 'Campo obligatorio',
                            min: { value: 1, message: 'La duración debe ser mayor a 0' }
                        })}
                    />
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
                    <button type="button" onClick={onCancelar} className="btn btn-secondary mx-1"> Cancelar</button>
                </div>
            </form>
        </>

    )
}