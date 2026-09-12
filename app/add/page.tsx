"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const COLOR_OPTIONS = [
  { label: "赤", code: "#ef4444" },
  { label: "ピンク", code: "#ec4899" },
  { label: "オレンジ", code: "#f97316" },
  { label: "黄色", code: "#eab308" },
  { label: "緑", code: "#22c55e" },
  { label: "水色", code: "#06b6d4" },
  { label: "青", code: "#3b82f6" },
  { label: "紫", code: "#a855f7" },
  { label: "黒", code: "#1f2937" },
  { label: "白", code: "#f3f4f6" },
];

export default function AddSpotPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [selectedColors, setSelectedColors] = useState<string[]>(["#ec4899"]);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const toggleColor = (code: string) => {
    if (selectedColors.includes(code)) {
      if (selectedColors.length > 1) {
        setSelectedColors(selectedColors.filter((c) => c !== code));
      }
    } else {
      setSelectedColors([...selectedColors, code]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      let imageUrl = "";

      // 画像が選択されている場合、Supabase Storage へアップロード
      if (imageFile) {
        const fileExt = imageFile.name.split(".").pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
        const filePath = `spots/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("spot-images")
          .upload(filePath, imageFile);

        if (uploadError) throw uploadError;

        // 公開URLを取得
        const { data: publicUrlData } = supabase.storage
          .from("spot-images")
          .getPublicUrl(filePath);

        imageUrl = publicUrlData.publicUrl;
      }

      const slug = `spot-${Math.random().toString(36).substring(2, 9)}`;

      const { error } = await supabase.from("spots").insert([
        {
          name,
          slug,
          description,
          address,
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
          push_colors: selectedColors,
          image_url: imageUrl || null,
          is_published: true,
        },
      ]);

      if (error) throw error;

      router.push("/");
      router.refresh();
    } catch (err: any) {
      console.error("Error inserting spot:", err);
      setErrorMsg(err.message || "スポットの登録に失敗しました。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">
        📍 新しいぬい活スポットを登録
      </h1>

      {errorMsg && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
          {errorMsg}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-white p-6 rounded-xl shadow-md border"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            スポット名 *
          </label>
          <input
            type="text"
            required
            placeholder="例: ○○カフェ 新宿店"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-pink-400 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            画像アップロード
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                setImageFile(e.target.files[0]);
              }
            }}
            className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            住所
          </label>
          <input
            type="text"
            placeholder="例: 東京都新宿区..."
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-pink-400 outline-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              緯度 (Latitude) *
            </label>
            <input
              type="number"
              step="any"
              required
              placeholder="例: 35.6895"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-pink-400 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              経度 (Longitude) *
            </label>
            <input
              type="number"
              step="any"
              required
              placeholder="例: 139.6917"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-pink-400 outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            おすすめ推しカラー（複数選択可）
          </label>
          <div className="flex flex-wrap gap-2">
            {COLOR_OPTIONS.map((c) => {
              const isSelected = selectedColors.includes(c.code);
              return (
                <button
                  key={c.code}
                  type="button"
                  onClick={() => toggleColor(c.code)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition ${
                    isSelected
                      ? "border-pink-500 bg-pink-50 text-pink-700 font-bold shadow-sm"
                      : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <span
                    className="w-3.5 h-3.5 rounded-full border border-black/10 inline-block"
                    style={{ backgroundColor: c.code }}
                  />
                  {c.label}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            おすすめポイント・メモ
          </label>
          <textarea
            rows={4}
            placeholder="ぬいの撮影スポットや光の入り方、メニューなど..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-pink-400 outline-none"
          />
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="w-1/2 py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md font-medium transition"
          >
            キャンセル
          </button>
          <button
            type="submit"
            disabled={loading}
            className="w-1/2 py-2 px-4 bg-pink-500 hover:bg-pink-600 text-white rounded-md font-medium disabled:opacity-50 transition"
          >
            {loading ? "送信中..." : "登録する"}
          </button>
        </div>
      </form>
    </div>
  );
}
