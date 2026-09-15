"use server";

import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export async function deleteSpot(spotId: string, imageUrl?: string) {
  try {
    // 1. 画像URLが存在する場合、Storageから画像ファイルを削除
    if (imageUrl) {
      // URLからファイル名部分（xxxx-xxxx.png等）を取り出す
      const fileName = imageUrl.split("/").pop();

      if (fileName) {
        const { error: storageError } = await supabase.storage
          .from("spot-images")
          .remove([fileName]);

        if (storageError) {
          console.error("Storage Delete Error:", storageError);
        }
      }
    }

    // 2. DB（spotsテーブル）からレコードを削除
    const { error: dbError } = await supabase
      .from("spots")
      .delete()
      .eq("id", spotId);

    if (dbError) {
      throw dbError;
    }

    // Topページのキャッシュを更新
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Delete Spot Error:", error);
    return { success: false, error: "削除に失敗しました" };
  }
}
