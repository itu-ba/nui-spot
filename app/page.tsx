import Link from "next/link";
import dynamic from "next/dynamic";
import { createClient } from "@/utils/supabase/server";
import MapWrapper from "@/components/MapWrapper";
import ColorBadge from "@/components/ColorBadge";

export default async function HomePage() {
  const supabase = await createClient();

  const { data: spots, error } = await supabase
    .from("spots")
    .select("*")
    .eq("is_published", true);

  if (error) {
    console.error("Data fetch error:", error);
  }

  return (
    <main className="min-h-screen p-8 bg-slate-50">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            🧸 ぬい活スポット検索
          </h1>
          <p className="text-slate-600">
            推しぬいと一緒に過ごせるおすすめカフェ・撮影スポット
          </p>
        </header>

        {/* マップ表示 */}
        <MapWrapper spots={spots || []} />

        {/* スポット一覧エリア */}
        {/* スポット一覧エリア */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {spots && spots.length > 0 ? (
            spots.map((spot) => (
              <Link
                key={spot.id}
                href={`/spots/${spot.slug}`}
                className="block bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition"
              >
                <h2 className="text-xl font-bold text-slate-800 mb-2">
                  {spot.name}
                </h2>
                <p className="text-slate-600 text-sm mb-4 line-clamp-2">
                  {spot.description || "詳細情報は準備中です。"}
                </p>

                {spot.push_colors && spot.push_colors.length > 0 && (
                  <div className="flex gap-2 mb-3">
                    {/* 推しカラー表示 */}
                    {spot.push_colors && spot.push_colors.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {spot.push_colors.map((color: string) => (
                          <ColorBadge key={color} colorCode={color} />
                        ))}
                      </div>
                    )}
                  </div>
                )}

                <p className="text-xs text-slate-400">{spot.address}</p>
              </Link>
            ))
          ) : (
            <div className="col-span-2 text-center py-12 text-slate-500">
              まだ登録されているスポットがありません。
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
