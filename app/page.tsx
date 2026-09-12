import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import SpotFilter from "@/components/SpotFilter";

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
        <header className="mb-8 flex flex-col sm:flex-row justify-between items-center gap-4 border-b pb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 mb-2">
              🧸 ぬい活スポット検索
            </h1>
            <p className="text-slate-600">
              推しぬいと一緒に過ごせるおすすめカフェ・撮影スポット
            </p>
          </div>
          <Link
            href="/add"
            className="bg-pink-500 hover:bg-pink-600 text-white px-5 py-2.5 rounded-lg font-medium shadow-sm transition whitespace-nowrap"
          >
            ＋ スポットを追加
          </Link>
        </header>

        {/* 検索・マップ・一覧コンポーネント */}
        <SpotFilter initialSpots={spots || []} />
      </div>
    </main>
  );
}
