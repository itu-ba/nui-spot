import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import ColorBadge from "@/components/ColorBadge";

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
    <main className="min-h-screen p-8 bg-slate-50">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-sm border border-slate-200 p-8">
        <Link
          href="/"
          className="inline-block text-sm text-slate-500 hover:text-slate-800 mb-6 transition"
        >
          ← トップページに戻る
        </Link>

        <h1 className="text-3xl font-bold text-slate-800 mb-4">{spot.name}</h1>

        {/* 推しカラータグ */}
        {spot.push_colors && spot.push_colors.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {spot.push_colors.map((color: string) => (
              <ColorBadge key={color} colorCode={color} />
            ))}
          </div>
        )}

        <div className="space-y-6 text-slate-600">
          <div>
            <h2 className="text-sm font-semibold text-slate-400 mb-1">説明</h2>
            <p className="whitespace-pre-wrap">
              {spot.description || "詳細情報は準備中です。"}
            </p>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-slate-400 mb-1">住所</h2>
            <p>{spot.address || "未設定"}</p>
          </div>
        </div>
      </div>
    </main>
  );
}
