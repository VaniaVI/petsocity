'use client';

import { useEffect, useState } from 'react';
import Badge from 'react-bootstrap/Badge';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

export default function WeatherBadge() {
  const [weather, setWeather] = useState<any>(null);

  useEffect(() => {
    fetch('https://ordenes-production-ac23.up.railway.app/api/v1/weather/current')
      .then(res => res.json())
      .then(data => setWeather(data))
      .catch(() => {});
  }, []);

  if (!weather) return null;

  const estado = weather.Estado ?? "";
  const temp = weather.Temp;

  const icon =
    estado.includes("Despejado") ? "☀️" :
    estado.includes("Nublado") ? "☁️" :
    estado.includes("Lluvia") ? "🌧️" :
    "🌡️";

  /** Tooltip contenido */
  const renderTooltip = (props: any) => (
    <Tooltip {...props}>
      <div className="text-start">
        <div><strong>🌤️ Estado:</strong> {estado}</div>
        {weather.Sensacion && <div><strong>🌡️ Sensación:</strong> {weather.Sensacion}°C</div>}
        {weather.Humedad && <div><strong>💧 Humedad:</strong> {weather.Humedad}%</div>}
        {weather.Viento && <div><strong>💨 Viento:</strong> {weather.Viento} km/h</div>}
      </div>
    </Tooltip>
  );

  return (
    <OverlayTrigger
      placement="bottom"
      overlay={renderTooltip}
      delay={{ show: 300, hide: 150 }}
    >
      <Badge
        bg="light"
        text="dark"
        className="me-3 px-3 py-2 d-flex align-items-center gap-2 shadow-sm weather-badge"
        style={{
          borderRadius: "999px",
          fontSize: "0.85rem",
          cursor: "default"
        }}
      >
        {/* ICONO */}
        <span style={{ fontSize: "1rem" }}>{icon}</span>

        {/* TEMPERATURA */}
        <strong>{temp}°C</strong>

        {/* CIUDAD (solo desktop) */}
        <span className="text-muted d-none d-md-inline">
          Santiago
        </span>
      </Badge>
    </OverlayTrigger>
  );
}
