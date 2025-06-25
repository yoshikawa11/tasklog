import { assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { add } from "../../commands/add.ts";
import { Task } from "../../types/task.ts";
import { ensureDataFile } from "../../utils/file.ts";
import { doneTask } from "../../commands/done.ts";

// テスト用のデータファイルパス
const testDataFilePath = "./tests/commands/test_tasks.json";
const testEventLogFilePath = "./tests/commands/test_eventLog.jsonl";
const testTimeLogFilePath = "./tests/commands/test_timeLog.jsonl";

Deno.test("done: タスクが正常に完了する", async () => {
  // 前準備: テスト用ファイルを空配列で初期化
  await ensureDataFile(testDataFilePath, "[]");

  const title = "テストタスク";
  const plannedMinutes = 30;

  await add(title, plannedMinutes, testDataFilePath, testEventLogFilePath);

  // ファイルからデータを読み込んで検証
  const data = await Deno.readTextFile(testDataFilePath);
  const tasks: Task[] = JSON.parse(data);
  const taskId = tasks[0].id;

  await doneTask(
    taskId,
    testDataFilePath,
    testEventLogFilePath,
    testTimeLogFilePath,
  );

  const data2 = await Deno.readTextFile(testDataFilePath);
  const updateTasks: Task[] = JSON.parse(data2);
  assertEquals(updateTasks.length, 1);
  assertEquals(updateTasks[0].title, title);
  assertEquals(updateTasks[0].actualMinutes, 0);
  assertEquals(updateTasks[0].status, "completed");

  // 後片付け: テスト用ファイルを削除
  await Deno.remove(testDataFilePath);
  await Deno.remove(testEventLogFilePath);
});
