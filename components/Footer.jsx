'use client'
import { CreditCard2Back, CreditCardFill, CreditCard } from "react-bootstrap-icons";

export default function Footer() {
    return (
        <div className="bg-white text-black pt-5 pb-4 text-center p-2 mt-3 border-top border-light">
            <div className="container text-md-start">
                <div className="row">
                    
                    {/* Sección 1: descripción */}
                    <div className="col-md-4 col-lg-4 col-xl-4 mx-auto mb-4">
                        <h6 className="text-uppercase fw-bold">PetSocity</h6>
                        <p>Tu tienda online de productos y accesorios para mascotas.</p>
                        
                        {/* Íconos alineados horizontalmente */}
                        <div 
                            className="d-flex justify-content-center justify-content-md-start align-items-center gap-3 mt-2"
                            style={{ flexWrap: "wrap" }}
                        >
                            <CreditCard2Back size={26} color="black" />
                            <CreditCardFill size={26} color="black" />
                            <CreditCard size={26} color="black" />
                        </div>
                    </div>

                    {/* Sección 2: enlaces */}
                    <div className="col-md-3 col-lg-3 col-xl-3 mx-auto mb-4">
                        <h6 className="text-uppercase fw-bold">Links</h6>
                        <ul className="list-unstyled">
                            <li><a href="/productos" className="text-black text-decoration-none d-block mb-1">Productos</a></li>
                            <li><a href="/nosotros" className="text-black text-decoration-none d-block mb-1">Nosotros</a></li>
                            <li><a href="/blogs" className="text-black text-decoration-none d-block mb-1">Blogs</a></li>
                            <li><a href="/contacto" className="text-black text-decoration-none d-block mb-1">Contacto</a></li>
                        </ul>
                    </div>

                    {/* Sección 3: Newsletter */}
                    <div className="col-md-5 col-lg-5 col-xl-5 mx-auto mb-md-0 mb-4">
                        <h6 className="text-uppercase fw-bold mb-3">Suscríbete a nuestro newsletter</h6>
                        <div className="input-group justify-content-center justify-content-md-start">
                            <div className="form-floating flex-grow-1" style={{ maxWidth: "300px" }}>
                                <input 
                                    type="email" 
                                    className="form-control" 
                                    id="floatingInput" 
                                    placeholder="name@example.com" 
                                />
                                <label htmlFor="floatingInput">Email address</label>
                            </div>
                            <button 
                                type="button" 
                                className="ms-2 px-3 py-2 fw-semibold"
                                style={{
                                    backgroundColor: "#5cbefb",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "10px",
                                    fontSize: "0.9rem",
                                    transition: "background-color 0.3s",
                                }}
                                onMouseOver={(e) => e.target.style.backgroundColor = "#e1f5fe"}
                                onMouseOut={(e) => e.target.style.backgroundColor = "#5cbefb"}
                            >
                                Suscríbete
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="text-center pt-3 mt-4 border-top border-light">
                <p className="mb-0">&copy; 2025 PetSocity. Todos los derechos reservados.</p>
            </div>
        </div>
    );
}
