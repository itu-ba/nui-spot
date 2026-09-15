import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import SpotFilter from "@/components/SpotFilter";
import Header from "@/components/Header";

export default async function HomePage() {
  const supabase = await createClient();

  const { data: spots, error } = await supabase
    .from("spots")
    .select("*")
    .eq("is_published", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Data fetch error:", error);
  }

  return (
    // 2. 画面全体を高さ100%のflexカラムにしてフッター等の配置もしやすく変更
    <div className="min-h-screen flex flex-col">
      {/* 3. 上部にHeaderを配置 */}
      <Header />

      {/* 4. メインエリアに flex-1 を付与 */}
      <main className="max-w-5xl mx-auto w-full px-4 py-8 flex-1">
        <SpotFilter initialSpots={spots || []} />
      </main>
    </div>
  );
}
