'use client'
import { useEffect, useState } from "react";
import ProductCard from "../../components/ProductCard";

export default function Products(){
    const [products, setProducts] = useState([])

    useEffect(() =>{
        async function fetchData() {
            const res = await fetch("./api/products");
            const data = await res.json();
            setProducts(data);
        }
        fetchData();
    },[]);
    return(
        <main className="container py-4">
            <header className="text-center mb-4">
                <h2>Nuestros Productos</h2>
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