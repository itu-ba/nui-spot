// components/Header.tsx
import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-pink-100 shadow-sm">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* ロゴ & キャッチコピー */}
        <Link href="/" className="flex items-center gap-2 group">
          <span className="text-2xl group-hover:scale-110 transition duration-200">
            🧸
          </span>
          <div>
            <h1 className="text-lg font-black bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
              ぬい活スポット検索
            </h1>
            <p className="text-[10px] text-slate-400 font-medium hidden sm:block">
              推しぬいとおでかけしよう！
            </p>
          </div>
        </Link>

        {/* 右側アクションボタン */}
        <div className="flex items-center gap-3">
          <Link
            href="/add"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold text-white bg-gradient-to-r from-pink-400 to-pink-500 hover:from-pink-500 hover:to-pink-600 shadow-md shadow-pink-200 hover:shadow-lg transition duration-200"
          >
            <span>✨</span> スポットを登録
          </Link>
        </div>
      </div>
    </header>
  );
}
