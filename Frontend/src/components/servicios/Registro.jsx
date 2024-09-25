import React from "react";
import serviciosServices from "../../services/servicios.services";
import { useForm } from "react-hook-form";

//revisar porfa, tipo debe ser select y precio debe ser alguna clase de decimal

export default function Registro({ setAction, planId }) {

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    console.log(data); //esta linea solo es para ver por consola cuando enviamos el registro
    const response = await serviciosServices.create(data);
    console.log("respuesta res: ", response);
    if (response.mensaje) {
      return;
    }
    setAction("C");
  };

  const cancelar = () => {
    setAction("C");
  };

  return (
    <div className="container_gral">
      <form className="form_gral" onSubmit={handleSubmit(onSubmit)}>
        <h3>Registrar un Servicio</h3>

        <div className="form-group">
          <label htmlFor="Nombre" className="form-label"> Nombre del servicio: </label>
          <input type="text" className="form-control" id="Nombre" {...register("Nombre", { required: "Este campo es requerido" })} />
          {errors.Nombre && (<span className="text-danger">{errors.Nombre.message}</span>)}
        </div>

        <div className="form-group">
          <label htmlFor="Descripcion" className="form-label"> Descripcion: </label>
          <input type="text" className="form-control" id="Descripcion" {...register("Descripcion", { required: "Este campo es requerido" })} />
          {errors.Descripcion && (<span className="text-danger">{errors.Descripcion.message}</span>)}
        </div>

        <div className="form-group">
          <label htmlFor="Precio" className="form-label"> Precio: </label>
          <input type="number" className="form-control" id="Precio" {...register("Precio", { required: "Este campo es requerido" })} />
          {errors.Precio && (<span className="text-danger">{errors.Precio.message}</span>)}
        </div>

        <div className="form-group text-center mt-3">
          <button type="submit" className="btn btn-primary">
            Guardar
          </button>
          <button type="button" onClick={cancelar} className="btn btn-secondary mx-2">
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
