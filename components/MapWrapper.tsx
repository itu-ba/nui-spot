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
};

export default function MapWrapper({ spots }: { spots: Spot[] }) {
  return <Map spots={spots} />;
}
