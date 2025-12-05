'use client';
import Image from "next/image";
import Link from "next/link";
import { ArrowRightCircle, ChevronLeft, ChevronRight } from "react-bootstrap-icons";
import { useRef, useEffect, useState} from "react";
import { API_URL } from "@/lib/services/productsService";

interface ApiCategoria {
  nombre: string;
}

interface ApiProducto {
  idProducto: number;
  nombre: string;
  descripcion: string;
  precio: number;
  categoria?: ApiCategoria;
}

interface ProductoFront {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  categoria: string;
  imagen: string;
  etiquetas: string[];
}


function mapApiProduct(apiProd: ApiProducto): ProductoFront {
  return {
    id: apiProd.idProducto,
    nombre: apiProd.nombre,
    descripcion: apiProd.descripcion,
    precio: Number(apiProd.precio),
    categoria: apiProd.categoria?.nombre ?? "",
    imagen: `/productos/perro${apiProd.idProducto ?? 1}.png`,
    etiquetas: [],
  };
}

export default function Home() {
  // ⬅️ ANTES: const trendingProducts = productos.filter(...)
  // ⬅️ AHORA: vienen desde el microservicio
  const [trendingProducts, setTrendingProducts] = useState<ProductoFront[]>([]);


  // cargar productos desde el microservicio
  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const res = await fetch(`${API_URL}/api/v1/productos`, {
          cache: "no-store",
        });
        if (!res.ok) throw new Error("Error al cargar productos tendencia");

        const data = await res.json();
        const allProducts = data.map(mapApiProduct);

        // Por ahora marcamos “tendencia” como: primeros 8 productos
        setTrendingProducts(allProducts.slice(0, 8));
      } catch (error) {
        console.error("[HOME] Error cargando productos tendencia:", error);
        setTrendingProducts([]);
      }
    };

    fetchTrending();
  }, []);

  // referencia al contenedor scrollable
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount =
        direction === "left" ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      scrollRef.current.scrollTo({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <main className="d-flex flex-column align-items-center justify-content-between min-vh-100">
      {/* 🐶 Banner principal */}
      <section className="container-fluid bg-info-subtle pt-0 pt-lg-5 rounded-4 shadow-sm with-full">
        <div className="row align-items-center justify-content-between">
          <div className="col-12 col-lg-6 py-5 d-flex align-items-center">
            <div
              className="w-100 ps-lg-5 ms-lg-5 text-center"
              style={{ maxWidth: "900px", paddingLeft: "clamp(1rem, 5vw, 3rem)" }}
            >
              <h1
                className="fw-bold mb-3"
                style={{
                  fontFamily: "'Fredoka', sans-serif",
                  fontSize: "clamp(2.5rem, 5vw, 4.2rem)",
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

              <Link
                href="/products"
                className="btn d-inline-flex align-items-center gap-2 px-4 py-2 fw-medium rounded-3"
                style={{
                  fontFamily: "'Fredoka', sans-serif",
                  color: "white",
                  backgroundColor: "#6432B8",
                }}
              >
                ¡Compra ahora!
                <ArrowRightCircle size={24} color="white" />
              </Link>
            </div>
          </div>

          {/* Imagen del banner */}
          <div className="col-12 col-lg-6 d-flex align-items-end justify-content-center justify-content-lg-end ">
            <div style={{ width: "100%", maxWidth: "800px", lineHeight: 0 }}>
              <Image
                src="/foto-banner.png"
                alt="Perro con juguete"
                width={600}
                height={600}
                priority
                style={{
                  width: "100%",
                  height: "auto",
                  objectFit: "cover",
                  objectPosition: "bottom",
                  display: "block",
                  marginBottom: "0",
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* 🛍️ Sección de productos tendencia */}
      <section className="container py-5 position-relative">
        <h2
          className="text-center mb-5 fw-bold"
          style={{ fontFamily: "'Fredoka', sans-serif" }}
        >
          🔥 Productos Tendencia 🔥
        </h2>

        {/* Botones de navegación */}
        <button
          onClick={() => scroll("left")}
          className="btn btn-light position-absolute top-50 start-0 translate-middle-y shadow"
          style={{ zIndex: 2 }}
        >
          <ChevronLeft size={24} />
        </button>
        <button
          onClick={() => scroll("right")}
          className="btn btn-light position-absolute top-50 end-0 translate-middle-y shadow"
          style={{ zIndex: 2 }}
        >
          <ChevronRight size={24} />
        </button>

        {/* Listado horizontal con scroll */}
        <div
          ref={scrollRef}
          className="d-flex gap-4 overflow-auto pb-3 px-5"
          style={{ scrollSnapType: "x mandatory" }}
        >
          {trendingProducts.map((product) => (
            <div
              key={product.id}
              className="card shadow-sm flex-shrink-0"
              style={{
                width: "250px",
                scrollSnapAlign: "start",
              }}
            >
              <Image
                src={product.imagen}
                alt={product.nombre}
                width={250}
                height={200}
                className="card-img-top"
                style={{ objectFit: "cover", height: "200px" }}
              />
              <div className="card-body text-center">
                <h6 className="card-title">{product.nombre}</h6>
                <p className="fw-bold text-success mb-2">
                  ${product.precio.toLocaleString("es-CL")}
                </p>
                <Link
                  href={`/products/${product.id}`}
                  className="btn btn-sm btn-primary"
                >
                  Ver detalle
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}