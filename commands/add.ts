import { dataFilePath } from "../utils/const.ts";
import { ensureDataFile } from "../utils/file.ts";

export async function add(
  title: string,
  plannedMinutes: number | null,
): Promise<void> {
  await ensureDataFile(dataFilePath);
  // タスク追加処理（未実装）
  // - タスク構造を作成
  // - ファイルへ保存
  // - logger.ts でログ記録
}
