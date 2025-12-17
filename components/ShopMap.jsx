"use client"

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import L from "leaflet"

const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
})

export default function TiendaMapa({
  nombre = "Petsocity - Tienda",
  direccion = "Santiago, Chile",
  lat = -33.4489,
  lng = -70.6693,
}) {
  return (
    <div style={{ height: 380, width: "100%", borderRadius: 12, overflow: "hidden" }}>
      <MapContainer
        center={[lat, lng]}
        zoom={15}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Marker position={[lat, lng]} icon={markerIcon}>
          <Popup>
            <b>{nombre}</b>
            <br />
            {direccion}
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  )
}
