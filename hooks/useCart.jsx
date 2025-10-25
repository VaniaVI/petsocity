import { useState, useEffect } from "react";

export function useCart() {
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const updateCartCount = () => {
      try {
        const cart = JSON.parse(localStorage.getItem("carrito") || "[]");
        const total = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);
        setCartCount(total);
      } catch (error) {
        console.error("Error al cargar el carrito:", error);
        setCartCount(0);
      }
    };

    updateCartCount();

    // Escuchar cambios en el carrito
    const handleStorageChange = () => updateCartCount();
    const handleCartUpdate = () => updateCartCount();

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("cartUpdated", handleCartUpdate);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("cartUpdated", handleCartUpdate);
    };
  }, []);

  return { cartCount };
}
