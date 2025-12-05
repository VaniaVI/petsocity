'use client'

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import ProductCard from "../../components/ProductCard";
import { Suspense } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api-producto-production.up.railway.app";

function mapApiProduct(apiProd) {
    return {
        id: apiProd.idProducto,           
        nombre: apiProd.nombre,
        descripcion: apiProd.descripcion,
        precio: Number(apiProd.precio),
        // categoria viene como objeto -> usamos solo el nombre
        categoria: apiProd.categoria?.nombre ?? "",
        // imagenUrl en backend -> imagen en el front
        imagen: `/productos/perro${id}.png`,
        // por ahora no existen etiquetas en BD, lo dejamos vacío
        etiquetas: []
    };
}

function Products() {
    const searchParams = useSearchParams();
    const category = searchParams.get("category");
    const tag = searchParams.get("tag");

    const [products, setProducts] = useState([]);

    useEffect(() => {
        async function fetchData() {
            // Llamamos al microservicio en Railway
            const res = await fetch(`${API_URL}/api/v1/productos`, {
                cache: "no-store",
            });

            const data = await res.json();

            // Adaptamos los productos al formato del front
            let filtered = data.map(mapApiProduct);

            // Filtrado por categoria
            if (category) {
                filtered = filtered.filter(
                    (prod) =>
                        prod.categoria &&
                        prod.categoria.toLowerCase() === category.toLowerCase()
                );
            }

            // Filtrado por etiquetas (si se llega a usar en un futuro)
            if (tag) {
                filtered = filtered.filter((prod) =>
                    prod.etiquetas?.includes(tag)
                );
            }

            setProducts(filtered);
        }

        fetchData();
    }, [category, tag]);

    return (
        <main className="container py-4">
            <header className="text-center mb-4">
                <h2>Nuestros Productos</h2>
                {category && `Categoría: ${category}`}
                {tag && `Etiqueta: ${tag}`}
                {!category && !tag && "Todos los productos"}
            </header>
            <nav></nav>
            <section className="row justify-content-center gap-3">
                {products.map((prod) => (
                    <ProductCard
                        key={prod.id}
                        product={prod}
                        className="col-12 col-sm-6 col-md-4 col-lg-3"
                    />
                ))}
            </section>
        </main>
    );
}

export default function ProductsPage() {
    return (
        <Suspense fallback={<p className="text-center py-4">Cargando productos...</p>}>
            <Products />
        </Suspense>
    );
}
