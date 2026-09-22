// app/components/MapPicker.tsx
"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// デフォルトのピンアイコン設定
const customIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export type MapPickerProps = {
  lat: number;
  lng: number;
  onChangeLocation: (lat: number, lng: number) => void;
};

// クリックやドラッグイベントを検知する内部コンポーネント
function LocationMarker({ lat, lng, onChangeLocation }: MapPickerProps) {
  const map = useMapEvents({
    click(e) {
      onChangeLocation(e.latlng.lat, e.latlng.lng);
    },
  });

  useEffect(() => {
    map.flyTo([lat, lng], map.getZoom());
  }, [lat, lng, map]);

  return (
    <Marker
      position={[lat, lng]}
      icon={customIcon}
      draggable={true}
      eventHandlers={{
        dragend: (e) => {
          const marker = e.target as L.Marker;
          const position = marker.getLatLng();
          onChangeLocation(position.lat, position.lng);
        },
      }}
    />
  );
}

export default function MapPicker({
  lat,
  lng,
  onChangeLocation,
}: MapPickerProps) {
  return (
    <MapContainer
      key="map-picker-container" // 重複初期化防止用のキーを追加
      center={[lat, lng]}
      zoom={15}
      scrollWheelZoom={false}
      className="w-full h-64 rounded-xl z-0 border border-slate-200"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <LocationMarker lat={lat} lng={lng} onChangeLocation={onChangeLocation} />
    </MapContainer>
  );
}
