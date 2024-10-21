import imagenUñas1 from '../../img/uñas1.jpg'
import imagenUñas2 from '../../img/uñas5.jpg'
import imagenUñas3 from '../../img/uñas3.jpg'
import "./Carrusel.scss"

const Carrusel = () => {
    return (
        <div id="carouselExampleAutoplaying" className="carousel slide" data-bs-ride="carousel">
        <div className="carousel-inner">
          <div className="carousel-item active">
            <img src={imagenUñas1} alt="Uñas1" className="d-block w-100 carousel-img" />
          </div>
          <div className="carousel-item">
            <img src={imagenUñas2} alt="Uñas2" className="d-block w-100 carousel-img" />
          </div>
          <div className="carousel-item">
            <img src={imagenUñas3} alt="Uñas3" className="d-block w-100 carousel-img" />
          </div>
        </div>
        <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleAutoplaying" data-bs-slide="prev">
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleAutoplaying" data-bs-slide="next">
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>
    )
}


export default Carrusel