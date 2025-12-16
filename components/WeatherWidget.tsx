"use client";
import { useEffect, useState } from "react";

export default function WeatherWidget() {
  const [location, setLocation] = useState<any>(null);
  const [status, setStatus] = useState("idle");

  useEffect(() => {
    if (!("geolocation" in navigator)) {
      setStatus("error");
      return;
    }

    setStatus("loading");

    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const res = await fetch(
            `https://ordenes-production-ac23.up.railway.app/api/v1/weather?lat=${coords.latitude}&lon=${coords.longitude}`
          );

          if (!res.ok) throw new Error("Error en la API");

          const data = await res.json();
          setLocation(data);
          setStatus("ok");
        } catch {
          setStatus("error");
        }
      },
      () => setStatus("denied")
    );
  }, []);

  if (status === "loading") return <p>Cargando ubicación…</p>;
  if (status === "denied") return <p>Ubicación denegada.</p>;
  if (status === "error") return <p>No se pudo obtener la ubicación.</p>;
  if (!location) return null;

  const loc = location?.locations?.[0];

  return (
    <div className="card mt-4 shadow-sm">
      <div className="card-header bg-info text-white">
        Tu ubicación aproximada
      </div>
      <div className="card-body">
        <p><strong>Ciudad:</strong> {loc?.name}</p>
        <p><strong>Región:</strong> {loc?.adminArea}</p>
        <p><strong>País:</strong> {loc?.country}</p>
      </div>
    </div>
  );
}
