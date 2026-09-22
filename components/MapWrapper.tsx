"use client";

import dynamic from "next/dynamic";

// Client Component の中で ssr: false を指定して Map を読み込む
const Map = dynamic(() => import("./Map"), { ssr: false });

type Spot = {
  id: string;
  name: string;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  slug?: string;
  description?: string;
  push_colors?: string[];
  image_url?: string;
  is_published?: boolean;
};

type MapWrapperProps = {
  spots: Spot[];
  userLocation?: { lat: number; lng: number } | null;
};

export default function MapWrapper({ spots, userLocation }: MapWrapperProps) {
  return <Map spots={spots} userLocation={userLocation} />;
}
