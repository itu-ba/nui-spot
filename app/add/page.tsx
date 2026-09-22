"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import dynamic from "next/dynamic";

// MapPickerの型定義
type MapPickerProps = {
  lat: number;
  lng: number;
  onChangeLocation: (lat: number, lng: number) => void;
};

// MapPickerをSSR無効で動的インポート（1つに統合）
const MapPicker = dynamic<MapPickerProps>(
  () => import("@/components/MapPicker"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-64 bg-slate-100 rounded-xl flex items-center justify-center text-xs text-slate-400">
        地図を読み込み中...
      </div>
    ),
  },
);

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
  { label: "黒", code: "#000000" },
  { label: "茶色", code: "#8b4513" },
  { label: "ベージュ", code: "#d97706" },
  { label: "グレー", code: "#6b7280" },
  { label: "白", code: "#ffffff" },
];

// デフォルト表示位置（東京駅周辺）
const DEFAULT_LAT = 35.681236;
const DEFAULT_LNG = 139.767125;

export default function AddSpotPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [latitude, setLatitude] = useState<number>(DEFAULT_LAT);
  const [longitude, setLongitude] = useState<number>(DEFAULT_LNG);
  const [selectedColors, setSelectedColors] = useState<string[]>(["#ec4899"]);
  const [imageFile, setImageFile] = useState<File | null>(null);

  // 1. 緯度経度から住所を取得（useCallbackでメモ化）
  const fetchAddressFromCoords = useCallback(
    async (lat: number, lng: number) => {
      try {
        // zoom=18 で一番細かい粒度まで検索
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&zoom=18&accept-language=ja`,
        );

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();

        if (data && data.display_name) {
          const parts = data.display_name
            .split(",")
            .map((p: string) => p.trim());

          const filteredParts = parts.filter((part: string) => {
            if (part === "日本" || part === "Japan") return false;
            if (/^\d{3}-?\d{4}$/.test(part)) return false; // 郵便番号を除外
            return true;
          });

          const fullAddress = filteredParts.reverse().join("");
          setAddress(fullAddress || data.display_name);
        }
      } catch (err) {
        console.error("住所の取得に失敗しました", err);
      }
    },
    [],
  );

  // 2. 地図上のピンが移動・タップされた時の処理
  const handleLocationChange = (lat: number, lng: number) => {
    setLatitude(lat);
    setLongitude(lng);
    fetchAddressFromCoords(lat, lng);
  };

  // 3. 現在地取得ボタンの押下処理
  const handleCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("お使いのブラウザは現在地取得に対応していません");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        handleLocationChange(lat, lng);
      },
      () => {
        alert(
          "現在地が取得できませんでした。位置情報の利用を許可してください。",
        );
      },
    );
  };

  // 4. 初回レンダリング時（現在地が取れれば現在地、拒否・失敗ならデフォルト位置）
  useEffect(() => {
    const initLocation = async () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            setLatitude(lat);
            setLongitude(lng);
            fetchAddressFromCoords(lat, lng);
          },
          (error) => {
            console.warn(
              "現在地の取得に失敗したため、デフォルト位置を使用します:",
              error.message,
            );
            fetchAddressFromCoords(DEFAULT_LAT, DEFAULT_LNG);
          },
          {
            timeout: 3000,
            enableHighAccuracy: true,
          },
        );
      } else {
        await fetchAddressFromCoords(DEFAULT_LAT, DEFAULT_LNG);
      }
    };

    initLocation();
  }, [fetchAddressFromCoords]);

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

      if (imageFile) {
        const fileExt = imageFile.name.split(".").pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
        const filePath = `spots/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("spot-images")
          .upload(filePath, imageFile);

        if (uploadError) throw uploadError;

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
          latitude,
          longitude,
          push_colors: selectedColors,
          image_url: imageUrl || null,
          is_published: true,
        },
      ]);

      if (error) throw error;

      router.push("/");
      router.refresh();
    } catch (err: unknown) {
      console.error("Error inserting spot:", err);
      if (err instanceof Error) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg("スポットの登録に失敗しました。");
      }
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
        className="space-y-5 bg-white p-6 rounded-xl shadow-md border border-slate-200"
      >
        {/* スポット名 */}
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
            className="w-full p-2.5 border rounded-md focus:ring-2 focus:ring-pink-400 outline-none text-sm"
          />
        </div>

        {/* 位置情報の選択（地図＋現在地ボタン） */}
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className="block text-sm font-medium text-gray-700">
              スポットの位置 *
            </label>
            <button
              type="button"
              onClick={handleCurrentLocation}
              className="text-xs font-bold text-pink-600 hover:text-pink-700 flex items-center gap-1"
            >
              🎯 現在地を取得
            </button>
          </div>

          <p className="text-xs text-slate-400 mb-2">
            地図をタップまたはピンをドラッグして位置を調整できます。
          </p>

          <MapPicker
            lat={latitude}
            lng={longitude}
            onChangeLocation={handleLocationChange}
          />
        </div>

        {/* 住所 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            住所 (ピン位置から自動設定)
          </label>
          <input
            type="text"
            placeholder="例: 東京都新宿区..."
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full p-2.5 border rounded-md focus:ring-2 focus:ring-pink-400 outline-none text-sm bg-slate-50"
          />
          <p className="text-[11px] text-slate-400 mt-1">
            ※自動入力後に番地（1-2-3等）や建物名を付け足すことができます。
          </p>
        </div>

        {/* 画像アップロード */}
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

        {/* 推しカラー */}
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
                    className="w-3.5 h-3.5 rounded-full border border-black/10 inline-block shrink-0"
                    style={{ backgroundColor: c.code }}
                  />
                  {c.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* メモ */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            おすすめポイント・メモ
          </label>
          <textarea
            rows={4}
            placeholder="ぬいの撮影スポットや光の入り方、メニューなど..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2.5 border rounded-md focus:ring-2 focus:ring-pink-400 outline-none text-sm"
          />
        </div>

        {/* 送信ボタン */}
        <div className="flex gap-4 pt-2">
          <button
            type="button"
            onClick={() => router.back()}
            className="w-1/2 py-2.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md font-medium text-sm transition"
          >
            キャンセル
          </button>
          <button
            type="submit"
            disabled={loading}
            className="w-1/2 py-2.5 px-4 bg-pink-500 hover:bg-pink-600 text-white rounded-md font-medium text-sm disabled:opacity-50 transition"
          >
            {loading ? "送信中..." : "登録する"}
          </button>
        </div>
      </form>
    </div>
  );
}
