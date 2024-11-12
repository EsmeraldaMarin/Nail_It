import React from 'react';
import "./Footer.scss"

const Footer = () => {
    return (
        <footer className="bg-dark text-light pt-4 borde">
            <div className="container">
                <div className="row">
                    {/* Sección de contacto y redes sociales */}
                    <div className="col-md-6 mb-4">
                        <h5 className="mb-3">Contáctanos</h5>
                        <p>¡Síguenos en nuestras redes sociales y contáctanos por cualquier consulta!</p>
                        <div className="d-flex gap-3">
                            <a href="https://www.instagram.com/ohmy.nailscba" target="_blank" rel="noopener noreferrer" className="text-light fs-3">
                                <i className="bi bi-instagram"></i>
                            </a>
                            <a href="https://wa.me/543517364511" target="_blank" rel="noopener noreferrer" className="text-light fs-3">
                                <i className="bi bi-whatsapp"></i>
                            </a>
                        </div>
                    </div>

                    {/* Sección del mapa */}
                    
                </div>

                <div className="text-center py-3">
                    <p className="mb-0">© 2024 Nail It - Oh My Nails. Todos los derechos reservados.</p>
                </div>
                    
            </div>
        </footer>
    );
};

export default Footer;
