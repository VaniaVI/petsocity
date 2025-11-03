
"use client";
// hooks/useCart.js
// ✅ Hook principal para gestión completa del carrito

import { useEffect, useState, useCallback } from "react";
import * as cartService from "@/lib/services/cartServices.js";

/**
 * Hook para gestión completa del carrito con método de envío
 * @param {string} initialMetodo - Método inicial: 'retiro' | 'domicilio'
 * @returns {Object}
 */
export function useCart(initialMetodo = "retiro") {
  const [metodo, setMetodo] = useState(initialMetodo);
  const [items, setItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [envio, setEnvio] = useState(0);
  const [total, setTotal] = useState(0);
  const [itemCount, setItemCount] = useState(0);

  /**
   * Actualiza todos los estados del carrito
   */
  const refresh = useCallback(() => {
    const totals = cartService.getTotals(metodo);
    setItems(totals.items);
    setSubtotal(totals.subtotal);
    setEnvio(totals.envio);
    setTotal(totals.total);
    setItemCount(totals.itemCount);
  }, [metodo]);

  /**
   * Efecto inicial y listener de cambios
   */
  useEffect(() => {
    // Ejecutar después del render para evitar hydration mismatch
    queueMicrotask(() => refresh());

    const listener = () => refresh();
    window.addEventListener("cartUpdated", listener);

    return () => window.removeEventListener("cartUpdated", listener);
  }, [refresh]);

  /**
   * Recalcula envío cuando cambia el método
   */
  useEffect(() => {
    const newEnvio = cartService.calculateEnvio(metodo, subtotal);
    setEnvio(newEnvio);
    setTotal(subtotal + newEnvio);
  }, [metodo, subtotal]);

  // ============================================
  // MÉTODOS PÚBLICOS
  // ============================================

  const addItem = useCallback((product, quantity) => {
    cartService.addItem(product, quantity);
  }, []);

  const removeItem = useCallback((id) => {
    cartService.removeItem(id);
  }, []);

  const updateQuantity = useCallback((id, quantity) => {
    cartService.updateQuantity(id, quantity);
  }, []);

  const incItem = useCallback((id) => {
    cartService.incrementItem(id);
  }, []);

  const decItem = useCallback((id) => {
    cartService.decrementItem(id);
  }, []);

  const clearCart = useCallback(() => {
    cartService.clearCart();
  }, []);

  return {
    // Estado
    items,
    subtotal,
    envio,
    total,
    itemCount,
    metodo,
    
    // Setters
    setMetodo,
    
    // Métodos
    addItem,
    removeItem,
    updateQuantity,
    incItem,
    decItem,
    clearCart,
    refresh,
    
    // Constantes
    constants: cartService.CART_CONSTANTS,
  };
}