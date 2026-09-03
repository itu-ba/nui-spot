"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Leafletのデフォルトアイコンの崩れを防止する設定
const defaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = defaultIcon;

type Spot = {
  id: string;
  name: string;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
};

export default function Map({ spots }: { spots: Spot[] }) {
  // 初期表示の標準位置（東京駅付近）
  const defaultCenter: [number, number] = [35.681236, 139.767125];

  return (
    <div className="w-full h-[400px] rounded-xl overflow-hidden shadow-sm border border-slate-200 mb-8">
      <MapContainer
        center={defaultCenter}
        zoom={12}
        scrollWheelZoom={false}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {spots.map((spot) => {
          if (!spot.latitude || !spot.longitude) return null;
          return (
            <Marker key={spot.id} position={[spot.latitude, spot.longitude]}>
              <Popup>
                <div className="text-sm">
                  <p className="font-bold">{spot.name}</p>
                  <p className="text-slate-500">{spot.address}</p>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
