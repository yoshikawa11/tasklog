import { assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { add } from "../../commands/add.ts";
import { Task } from "../../types/task.ts";
import { ensureDataFile } from "../../utils/file.ts";

// テスト用のデータファイルパス
const testDataFilePath = "./tests/commands/test_tasks.json";

Deno.test("add: 新しいタスクが正常に追加される", async () => {
  // 前準備: テスト用ファイルを空配列で初期化
  await ensureDataFile(testDataFilePath, "[]");

  const title = "テストタスク";
  const plannedMinutes = 30;

  await add(title, plannedMinutes, testDataFilePath);

  // ファイルからデータを読み込んで検証
  const data = await Deno.readTextFile(testDataFilePath);
  const tasks: Task[] = JSON.parse(data);

  assertEquals(tasks.length, 1);
  assertEquals(tasks[0].title, title);
  assertEquals(tasks[0].plannedMinutes, plannedMinutes);

  // 後片付け: テスト用ファイルを削除
  await Deno.remove(testDataFilePath);
});
