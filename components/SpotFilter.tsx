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

// 全カラーの固定リスト
const ALL_COLORS = [
  { code: "#ef4444", name: "赤" },
  { code: "#ec4899", name: "ピンク" },
  { code: "#f97316", name: "オレンジ" },
  { code: "#eab308", name: "黄色" },
  { code: "#22c55e", name: "緑" },
  { code: "#06b6d4", name: "水色" },
  { code: "#3b82f6", name: "青" },
  { code: "#a855f7", name: "紫" },
  { code: "#000000", name: "黒" },
  { code: "#8b4513", name: "茶色" },
  { code: "#d97706", name: "ベージュ" },
  { code: "#6b7280", name: "グレー" },
  { code: "#ffffff", name: "白" },
];

export default function SpotFilter({ initialSpots }: { initialSpots: Spot[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedColor, setSelectedColor] = useState<string>("ALL");

  const filteredSpots = initialSpots.filter((spot) => {
    const matchesQuery =
      searchQuery === "" ||
      spot.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      spot.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      spot.address?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesColor =
      selectedColor === "ALL" ||
      (spot.push_colors &&
        spot.push_colors.some(
          (c) => c.toLowerCase() === selectedColor.toLowerCase(),
        ));

    return matchesQuery && matchesColor;
  });

  return (
    <div>
      {/* 検索・フィルターエリア */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 mb-6 space-y-4">
        <div>
          <input
            type="text"
            placeholder="🔍 スポット名、エリア、キーワードで検索..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-pink-400 focus:border-transparent outline-none transition bg-slate-50/50 focus:bg-white"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-slate-100 text-sm">
          <span className="text-xs font-bold text-slate-500 mr-1">
            推しカラー:
          </span>
          <button
            type="button"
            onClick={() => setSelectedColor("ALL")}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition ${
              selectedColor === "ALL"
                ? "bg-slate-800 text-white shadow-sm"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            すべて ({initialSpots.length})
          </button>

          {ALL_COLORS.map((color) => {
            const isSelected =
              selectedColor.toLowerCase() === color.code.toLowerCase();

            return (
              <button
                key={color.code}
                type="button"
                onClick={() =>
                  setSelectedColor(isSelected ? "ALL" : color.code)
                }
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition ${
                  isSelected
                    ? "border-pink-500 bg-pink-50 text-pink-700 font-bold shadow-sm ring-2 ring-pink-400"
                    : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                <span
                  className="w-3 h-3 rounded-full border border-black/10 inline-block shrink-0"
                  style={{ backgroundColor: color.code }}
                />
                {color.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* マップ */}
      <MapWrapper spots={filteredSpots} />

      {/* 一覧カード */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        {filteredSpots.length > 0 ? (
          filteredSpots.map((spot) => (
            <Link
              key={spot.id}
              href={`/spots/${spot.slug}`}
              className="group flex flex-col bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md hover:border-pink-200 transition duration-200"
            >
              {/* 画像エリア（画像が無い場合はダミーデザインを表示） */}
              <div className="w-full h-48 bg-slate-100 overflow-hidden relative">
                {spot.image_url ? (
                  <img
                    src={spot.image_url}
                    alt={spot.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-pink-50 via-slate-50 to-pink-100/50 flex flex-col items-center justify-center text-slate-400 gap-1">
                    <span className="text-3xl">🧸</span>
                    <span className="text-xs font-medium text-slate-400">
                      No Image
                    </span>
                  </div>
                )}
              </div>

              {/* テキストコンテンツエリア */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-800 mb-1 group-hover:text-pink-600 transition">
                    {spot.name || "詳細情報は準備中です。"}
                  </h2>
                  <p className="text-slate-600 text-xs leading-relaxed mb-4 line-clamp-2">
                    {spot.description || "詳細情報は準備中です。"}
                  </p>
                </div>

                <div>
                  {spot.push_colors && spot.push_colors.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {spot.push_colors.map((color) => (
                        <ColorBadge key={color} colorCode={color} />
                      ))}
                    </div>
                  )}

                  <p className="text-xs text-slate-400 flex items-center gap-1">
                    <span>📍</span> {spot.address || "住所未登録"}
                  </p>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="col-span-2 text-center py-12 text-slate-500 bg-white rounded-2xl border border-dashed border-slate-200">
            <p className="text-2xl mb-2">🔍</p>
            該当するスポットが見つかりませんでした。
          </div>
        )}
      </div>
    </div>
  );
}
