import React, { useEffect, useState } from "react";
//import serviciosServices from "../../services/servicios.services";
import { useNavigate, useParams } from "react-router-dom";
//import Registro from "./Registro";
import axios from '../../axiosConfig/axiosConfig';
//import EnSesion from "../EnSesion";
import "./Consulta.scss"
//import planificacionesServices from "../../services/planificaciones.services";

export default function Consulta() {

  const [action, setAction] = useState('C');
  const [rows, setRows] = useState([]);
  const [filter, setFilter] = useState("");
  const navigate = useNavigate();

  const { planId } = useParams();

  // useEffect(() => {
  //   const verifyPlanId = async () => {
  //     try {
  //       const res = await axios.get(`http://localhost:5050/servicio/${planId}`);
  //       console.log(res)
  //       if (!res) {
  //         navigate("/error");
  //       }
  //     } catch (error) {
  //       navigate("/error");
  //     }
  //   };

  //   verifyPlanId();
  // }, [planId, navigate]);

  const loadData = async () => {
    try {
      const res = await axios.get(`http://localhost:5050/servicio`);
      setRows(res.data);
    } catch (error) {
      console.error("Error al obtener los datos: ", error);
      setRows([]);
    }
  };

  useEffect(() => {
    loadData();
  }, [action === 'C']);

  useEffect(() => {
    const filasFiltradas = async () => {
      if (filter) {
        try {
          //const filasFiltradas = await serviciosServices.getByFilter(filter, planId);
          //setRows(filasFiltradas);
        } catch (error) {
          console.error("Error al obtener los datos: ", error);
          setRows([]);
        }
      } else {
        loadData();
      }
    };
    filasFiltradas();
  }, [filter]);

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const handleDeleteServicio = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este servicio?'))
      //await serviciosServices.remove(id);
      loadData();
  };

  return (
    <div className="bg-gral">
      {/* {<EnSesion />} */}
      {action === "C" && (
        <div className="container mt-5">
          <h2>Mis servicios</h2>
          <div className="barra_filtro">
            <input type="text" className="form-control" placeholder="Filtrar por nombre" value={filter} onChange={handleFilterChange} />
          </div>

          <table className="table table-hover">
            <thead>
              <tr className='table-dark'>
                <th scope="col">Nombre</th>
                <th scope="col">Precio</th>
                <th scope="col">Fecha Registro</th>
                <th scope="col">Duracion</th>
                <th scope="col">Acciones</th>

              </tr>
            </thead>
            <tbody>
              {rows.length > 0 ? (rows.map((servicio) => (
                <tr key={servicio.id}>
                  <td>{servicio.nombre}</td>
                  <td>{servicio.precio}</td>
                  <td>{servicio.FechaRegistro}</td>
                  <td>{servicio.duracion}</td>
                  <td>
                    <button className="btn btn-primary mx-1" onClick={() => navigate(`/servicios/actualizar/${servicio.ID}/${planId}`)}>Actualizar</button>
                    <button className="btn btn-danger mx-1" onClick={async () => await handleDeleteServicio(servicio.ID)}>Eliminar</button>
                  </td>
                </tr>
              ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center">No hay servicios disponibles</td>
                </tr>
              )
              }
            </tbody>
          </table>
          <button onClick={() => setAction("R")} className="btn btn-primary mx-2"> Registrar Nuevo Servicio </button>
          {/* <button onClick={() => navigate(`/inicio_admin/${planId}`)} className="btn btn-secondary mx-2" > Volver al menu </button> */}
          <button
            onClick={() => navigate("/inicio_admin")}
            className="btn btn-secondary mx-2"
          >
            Volver al inicio
          </button>
        </div>
      )}
      {
        /*action === "R" && (<Registro setAction={setAction} planId={planId}></Registro>)*/
      }
    </div>
  );
}
