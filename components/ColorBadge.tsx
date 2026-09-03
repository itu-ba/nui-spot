export default function ColorBadge({ colorCode }: { colorCode: string }) {
  // # が付いていなければ付与する処理
  const formattedColor = colorCode.startsWith("#")
    ? colorCode
    : `#${colorCode}`;

  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200 shadow-sm">
      <span
        className="w-3 h-3 rounded-full border border-black/10 inline-block"
        style={{ backgroundColor: formattedColor }}
      />
      {formattedColor}
    </span>
  );
}
