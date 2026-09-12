type Props = {
  colorCode: string;
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

export default function ColorBadge({ colorCode }: Props) {
  const label = COLOR_MAP[colorCode.toLowerCase()] || colorCode;

  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
      <span
        className="w-2.5 h-2.5 rounded-full border border-black/10 inline-block"
        style={{ backgroundColor: colorCode }}
      />
      {label}
    </span>
  );
}
