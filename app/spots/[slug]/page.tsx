import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import ColorBadge from "@/components/ColorBadge";
import DeleteButton from "@/components/DeleteButton";

export default async function SpotDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  // URLのslugに基づいてSupabaseから1件取得
  const { data: spot, error } = await supabase
    .from("spots")
    .select("*")
    .eq("slug", slug)
    .single();

  // データが見つからない場合は404ページを表示
  if (error || !spot) {
    notFound();
  }

  return (
    <main className="min-h-screen py-10 px-4 bg-slate-50/60">
      <div className="max-w-2xl mx-auto">
        {/* ヘッダーエリア（戻るリンク & 削除ボタン） */}
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-pink-600 transition"
          >
            ← トップページに戻る
          </Link>

          {/* 削除ボタン */}
          <DeleteButton spotId={spot.id} imageUrl={spot.image_url} />
        </div>

        {/* メインカード */}
        <article className="bg-white rounded-3xl shadow-sm border border-slate-200/80 overflow-hidden">
          {/* メイン画像エリア */}
          <div className="w-full h-64 sm:h-80 bg-slate-100 relative">
            {spot.image_url ? (
              <img
                src={spot.image_url}
                alt={spot.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-pink-50 via-slate-50 to-pink-100/50 flex flex-col items-center justify-center text-slate-400 gap-2">
                <span className="text-4xl">🧸</span>
                <span className="text-xs font-medium text-slate-400">
                  No Image
                </span>
              </div>
            )}
          </div>

          {/* 詳細コンテンツ */}
          <div className="p-6 sm:p-8 space-y-6">
            {/* スポット名 */}
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 leading-tight mb-3">
                {spot.name}
              </h1>

              {/* 推しカラータグ */}
              {spot.push_colors && spot.push_colors.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <span className="text-xs font-bold text-slate-400 mr-1">
                    推しカラー:
                  </span>
                  {spot.push_colors.map((color: string) => (
                    <ColorBadge key={color} colorCode={color} />
                  ))}
                </div>
              )}
            </div>

            <hr className="border-slate-100" />

            {/* スポット概要・説明文 */}
            <div className="space-y-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                📝 スポットの概要
              </h2>
              <p className="text-slate-700 leading-relaxed whitespace-pre-wrap text-sm sm:text-base">
                {spot.description || "詳細情報は準備中です。"}
              </p>
            </div>

            {/* 住所情報 */}
            <div className="space-y-2 bg-slate-50/80 p-4 rounded-2xl border border-slate-100">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                📍 所在地
              </h2>
              <p className="text-slate-700 font-medium text-sm sm:text-base">
                {spot.address || "住所未登録"}
              </p>
            </div>
          </div>
        </article>
      </div>
    </main>
  );
}
