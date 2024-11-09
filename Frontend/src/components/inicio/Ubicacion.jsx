import "./Ubicacion.scss"


const Ubicacion = () => {
    return(
        <div className="col-md-12 d-flex justify-content-center mb-4">
            <div className="map-container">
                <h5 className="mb-3">Nuestra Ubicación</h5>
                <div className="ratio ratio-16x9">
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3454.1286749483273!2d-64.1894235255658!3d-31.412928160533695!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94329976a56e06b5%3A0x504e9fba54c5f4de!2sAv.%2024%20de%20Septiembre%201500%2C%20X5000ICN%20C%C3%B3rdoba!5e0!3m2!1ses!2sar!4v1697646449622!5m2!1ses!2sar"
                    width="600"
                    height="450"
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Ubicación del local de estética"
                ></iframe>
                </div>
            </div>
            </div>
    )
}

export default Ubicacion