import { assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { clearTask } from "../../commands/clear.ts";
import { readTasksFromFile, writeTasksToFile } from "../../utils/file.ts";

const testDataFilePath = "./tests/commands/test_tasks.json";
const testEventLogFilePath = "./tests/commands/test_eventlog.jsonl";

Deno.test("clearTask: タスクファイルが初期化され、イベントログが記録される", async () => {
  // 前準備: テスト用タスクファイルにダミータスクを書き込み
  await writeTasksToFile(testDataFilePath, [
    {
      id: "dummy",
      title: "ダミータスク",
      createdAt: "2025-06-25T10:00:00.000Z",
      plannedMinutes: 10,
      actualMinutes: null,
      status: "pending",
    },
  ], "[]");

  // テスト実行
  await clearTask(testDataFilePath, testEventLogFilePath);

  // タスクファイルが空配列になっていることを確認
  const tasks = await readTasksFromFile(testDataFilePath);
  assertEquals(tasks, []);

  // イベントログが1行追加されていることを確認
  const eventLog = await Deno.readTextFile(testEventLogFilePath);
  const lines = eventLog.trim().split("\n");
  assertEquals(lines.length, 1);

  // 後片付け
  await Deno.remove(testDataFilePath);
  await Deno.remove(testEventLogFilePath);
});
