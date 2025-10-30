'use client';
import Image from "next/image";
import { ArrowRightCircle } from "react-bootstrap-icons";


export default function Home() {
  return (
    <main className="d-flex flex-column align-items-center justify-content-between min-vh-100">
      {/* 🐶 Banner principal */}
      <section className="container-fluid bg-info-subtle pt-0 pt-lg-5 rounded-4 shadow-sm with-full">
        <div className="row align-items-center justify-content-between">
          {/* Texto del banner */}
          <div className="col-12 col-lg-6 py-5 d-flex align-items-center">
            <div className="w-100 ps-lg-5 ms-lg-5 text-center" style={{ maxWidth: '900px', paddingLeft: 'clamp(1rem, 5vw, 3rem)' }}>
            <h1
              className="fw-bold mb-3"
              style={{
                fontFamily: "'Fredoka', sans-serif",
                fontSize: "clamp(2.5rem, 5vw, 4.2rem)"
                
              }}
            >
              Hechos para resistir <br /> y emocionar.
            </h1>

            <p
              className="lead fw-normal text-warning mb-4"
              style={{
                fontFamily: "'Fredoka', sans-serif",
                fontSize: "clamp(1.2rem, 3vw, 1.5rem)",
              }}
            >
              Haz feliz a tu compañero peludo.
            </p>

            <a
              href="/productos"
              className="btn d-inline-flex align-items-center gap-2 px-4 py-2 fw-medium rounded-3"
              style={{ fontFamily: "'Fredoka', sans-serif" , color:"white", backgroundColor:'#6432B8'}}
            >
              ¡Compra ahora!
              <ArrowRightCircle size={24} color="white"/>
            </a>
          </div>
          </div>
          {/* Imagen del banner */}
          <div className="col-12 col-lg-6 d-flex align-items-end justify-content-center justify-content-lg-end ">
            <div style={{ 
              width: '100%', 
              maxWidth: '800px',
              lineHeight: 0 // Elimina espacio inferior
            }}>
              <Image
                src="/foto-banner.png"
                alt="Perro con juguete"
                width={600}
                height={600}
                priority
                style={{
                  width: '100%',
                  height: 'auto',
                  objectFit: 'cover',
                  objectPosition: 'bottom',
                  display: 'block',
                  marginBottom: '0' // Toca el borde inferior
                }}
              />
            </div>
          </div>
          </div>
      </section>

      {/* 🛍️ Sección de productos tendencia */}
      <section className="container py-5">
        <h2
          className="text-center mb-5 fw-bold"
          style={{
            fontFamily: "'Fredoka', sans-serif",
          }}
        >
          🔥 Productos Tendencia 🔥
        </h2>

        <div className="row g-4 justify-content-center">
    
        </div>
      </section>
    </main>
  );
}
