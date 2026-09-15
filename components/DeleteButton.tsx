"use client";

import { useRouter } from "next/navigation";
import { deleteSpot } from "@/app/actions/deleteSpot";

type Props = {
  spotId: string;
  imageUrl?: string;
};

export default function DeleteButton({ spotId, imageUrl }: Props) {
  const router = useRouter();

  const handleDelete = async () => {
    if (
      !confirm(
        "このスポットを削除しますか？\n（画像データも一緒に削除されます）",
      )
    ) {
      return;
    }

    const res = await deleteSpot(spotId, imageUrl);

    if (res.success) {
      alert("削除しました");
      router.push("/");
      router.refresh();
    } else {
      alert("削除に失敗しました");
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 transition border border-red-200"
    >
      🗑️ このスポットを削除
    </button>
  );
}
