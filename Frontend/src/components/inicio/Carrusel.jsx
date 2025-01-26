import imagenUñas1 from '../../img/uñas1.jpg'
import imagenUñas2 from '../../img/uñas5.jpg'
import imagenUñas3 from '../../img/uñas3.jpg'
import "./Carrusel.scss"

const Carrusel = () => {
  return (
    <div id="inicio" className="inicio">
      <h1>Oh My Nails</h1>
      <img src={imagenUñas1} alt="Uñas1" className="d-block w-100 carousel-img" />

    </div>
  )
}


export default Carrusel