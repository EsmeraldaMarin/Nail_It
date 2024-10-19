
import {useForm} from 'react-hook-form' 

export default function RegistroEspecialidad ({onGuardarEsp, onCancelarEsp}) {

    const {register, handleSubmit, formState: {errors}, } = useForm()

    const onSubmit = (data) => {
        onGuardarEsp(data)
    }
    return(
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <h5>{'Nueva Especialidad'}</h5>
                <div className="form-group">
                    <label htmlFor="nombre">Nombre de la especialidad </label>
                    <input type="text" className="form-control" id="nombre" placeholder="Ingrese Nombre de la especialidad"
                    {...register('nombre', {required: 'Campo obligatorio'})} />
                    {errors.nombre && <span className="text-danger">{errors.nombre.message}</span>}
                </div>
                <div className="form-group">
                    <label htmlFor="descripcion">Descripción de la Especialidad</label>
                    <textarea type="textarea" className="form-control" id="precio" placeholder="Ingrese una breve descripcion"
                    {...register('descripcion', {required: 'Campo obligatorio'})} />
                    {errors.descripcion && <span className="text-danger">{errors.descripcion.message}</span>}
                </div>
                <div className="form-group mt-3">
                    <button type="submit" className="btn btn-primary mx-1">Guardar</button>
                    <button type="button" onClick={onCancelarEsp}  className="btn btn-secondary mx-1"> Cancelar</button>
                </div>
            </form>
        </>
    )
}