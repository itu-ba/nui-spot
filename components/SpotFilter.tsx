"use client";

import { useState } from "react";
import MapWrapper from "@/components/MapWrapper";
import ColorBadge from "@/components/ColorBadge";
import Link from "next/link";

type Spot = {
  id: string;
  name: string;
  slug: string;
  description: string;
  address: string;
  latitude: number;
  longitude: number;
  push_colors: string[];
  image_url?: string;
  is_published: boolean;
};

const COLOR_MAP: Record<string, string> = {
  "#ef4444": "赤",
  "#ec4899": "ピンク",
  "#f97316": "オレンジ",
  "#eab308": "黄色",
  "#22c55e": "緑",
  "#06b6d4": "水色",
  "#3b82f6": "青",
  "#a855f7": "紫",
  "#1f2937": "黒",
  "#f3f4f6": "白",
};

export default function SpotFilter({ initialSpots }: { initialSpots: Spot[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedColor, setSelectedColor] = useState<string>("ALL");

  const allColors = Array.from(
    new Set(initialSpots.flatMap((spot) => spot.push_colors || [])),
  );

  const filteredSpots = initialSpots.filter((spot) => {
    const matchesQuery =
      searchQuery === "" ||
      spot.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      spot.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      spot.address?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesColor =
      selectedColor === "ALL" ||
      (spot.push_colors && spot.push_colors.includes(selectedColor));

    return matchesQuery && matchesColor;
  });

  return (
    <div>
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-6 space-y-4">
        <div>
          <input
            type="text"
            placeholder="🔍 スポット名、エリア、キーワードで検索..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-pink-400 outline-none"
          />
        </div>

        {allColors.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-sm">
            <span className="text-xs font-bold text-slate-500 mr-1">
              推しカラーで絞り込み:
            </span>
            <button
              onClick={() => setSelectedColor("ALL")}
              className={`px-3 py-1 rounded-full text-xs font-medium transition ${
                selectedColor === "ALL"
                  ? "bg-slate-800 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              すべて ({initialSpots.length})
            </button>

            {allColors.map((color) => {
              const label = COLOR_MAP[color.toLowerCase()] || color;
              return (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border transition ${
                    selectedColor === color
                      ? "border-pink-500 bg-pink-50 text-pink-700 font-bold"
                      : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <span
                    className="w-3 h-3 rounded-full border border-black/10 inline-block"
                    style={{ backgroundColor: color }}
                  />
                  {label}
                </button>
              );
            })}
          </div>
        )}
      </div>

      <MapWrapper spots={filteredSpots} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        {filteredSpots.length > 0 ? (
          filteredSpots.map((spot) => (
            <Link
              key={spot.id}
              href={`/spots/${spot.slug}`}
              className="block bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition"
            >
              {spot.image_url && (
                <div className="w-full h-48 bg-slate-100 overflow-hidden flex items-center justify-center">
                  <img
                    src={spot.image_url}
                    alt={spot.name}
                    className="w-full h-full object-cover" // ← 縦横比を保ってきれいに切り抜くならこのまま
                  />
                </div>
              )}
              <div className="p-6">
                <h2 className="text-xl font-bold text-slate-800 mb-2">
                  {spot.name || "詳細情報は準備中です。"}
                </h2>
                <p className="text-slate-600 text-sm mb-4 line-clamp-2">
                  {spot.description || "詳細情報は準備中です。"}
                </p>

                {spot.push_colors && spot.push_colors.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {spot.push_colors.map((color) => (
                      <ColorBadge key={color} colorCode={color} />
                    ))}
                  </div>
                )}

                <p className="text-xs text-slate-400">{spot.address}</p>
              </div>
            </Link>
          ))
        ) : (
          <div className="col-span-2 text-center py-12 text-slate-500 bg-white rounded-xl border border-dashed border-slate-200">
            該当するスポットが見つかりませんでした。
          </div>
        )}
      </div>
    </div>
  );
}
