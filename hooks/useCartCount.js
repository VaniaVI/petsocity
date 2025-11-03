"use client";
// hooks/useCartCount.js
// ✅ Hook liviano para mostrar contador de items en navbar/header

import { useEffect, useState } from "react";
import * as cartService from "@/lib/services/cartServices.js";

/**
 * Hook para obtener solo el contador de items del carrito
 * Útil para componentes que solo necesitan mostrar la cantidad
 * @returns {number}
 */
export function useCartCount() {
  const [count, setCount] = useState(0);

  const updateCount = () => {
    const { itemCount } = cartService.getTotals();
    setCount(itemCount);
  };

  useEffect(() => {
    // Ejecutar después del render para evitar hydration mismatch
    queueMicrotask(() => updateCount());

    const listener = () => updateCount();
    window.addEventListener("cartUpdated", listener);

    return () => window.removeEventListener("cartUpdated", listener);
  }, []);

  return count;
}