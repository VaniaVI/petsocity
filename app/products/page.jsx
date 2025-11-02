'use client'
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import ProductCard from "../../components/ProductCard";

export default function Products(){
    const searchParams = useSearchParams();
    const category = searchParams.get("category");
    const tag = searchParams.get("tag");

    const [products, setProducts] = useState([])

    useEffect(() =>{
        async function fetchData() {
            const res = await fetch("./api/products");
            const data = await res.json();

            let filtered = data;

            if(category){
                filtered = filtered.filter(prod => prod.categoria === category);
            }

            if(tag){
                filtered = filtered.filter(prod => prod.etiquetas?.includes(tag));
            }
            setProducts(filtered);
        }
        {/*Funcion para obtener los productos*/}
        fetchData();
      {/* si alguno de estos valores cambia, se vuelve a  ejecutar el fetch */}
    },[category,tag]);

    return(
        <main className="container py-4">
            <header className="text-center mb-4">
                <h2>Nuestros Productos</h2>
                {category && `Categoría: ${category}`}
                {tag && `Etiqueta: ${tag}`}
                {!category && !tag && "Todos los productos"}
            </header>
            <nav>

            </nav>
            {/* Aqui se insertan dinamicamento los productos llamando a la api y al componente de productCard */}
            <section className="row justify-content-center gap-3">
                {products.map(prod =>(
                    <ProductCard key={prod.id} product={prod} className="col-12 col-sm-6 col-md-4 col-lg-3"/>
                ))}
            </section>
        </main>
    )
}