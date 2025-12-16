"use client";
import { useEffect, useState } from "react";

export default function WeatherWidget() {
  const [weather, setWeather] = useState<any>(null);
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
              `https://ordenes-production-ac23.up.railway.app/api/v1/weather?lat=-33.45&lon=-70.66`
          );
          if (!res.ok) throw new Error("Error en la API");
          const data = await res.json();
          setWeather(data);
          setStatus("ok");
        } catch {
          setStatus("error");
        }
      },
      () => setStatus("denied")
    );
  }, []);

  if (status === "loading") return <p>Cargando clima…</p>;
  if (status === "denied") return <p>Ubicación denegada.</p>;
  if (status === "error") return <p>No se pudo obtener el clima.</p>;
  if (!weather) return null;

  const today = weather?.forecast?.[0];
  return (
    <div className="card mt-3">
      <div className="card-header bg-info text-white">Clima en tu zona</div>
      <div className="card-body">
        <p><strong>Temperatura:</strong> {today?.temperature?.max}°C máx / {today?.temperature?.min}°C mín</p>
        <p><strong>Condición:</strong> {today?.symbol?.desc}</p>
      </div>
    </div>
  );
}
