"use client";
import { useEffect, useState } from "react";
import * as cartService from "@/lib/services/cartServices.js";

export function useCartCount() {
  const [count, setCount] = useState(0);

  const updateCount = () => {
    try {
      const { itemCount } = cartService.getTotals();
      setCount(itemCount);
    } catch {
      setCount(0);
    }
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    queueMicrotask(updateCount);

    window.addEventListener("cartUpdated", updateCount);
    return () => window.removeEventListener("cartUpdated", updateCount);
  }, []);

  return count;
}
