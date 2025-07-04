import { assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { deleteTask } from "../../commands/delete.ts";
import { readTasksFromFile, writeTasksToFile } from "../../utils/file.ts";
import { Task } from "../../types/task.ts";
import { TaskContext } from "../../types/taskContext.ts";

const testDataFilePath = "./tests/commands/test_tasks.json";
const testEventLogFilePath = "./tests/commands/test_eventlog.jsonl";

Deno.test("deleteTask: 指定したタスクが削除される", async () => {
  // 前準備: テスト用ファイルを初期化
  const tasks: Task[] = [
    {
      id: "test-id-1",
      title: "タスク1",
      createdAt: "2025-06-23T10:00:00.000Z",
      plannedMinutes: 60,
      actualMinutes: null,
      status: "pending",
    },
    {
      id: "test-id-2",
      title: "タスク2",
      createdAt: "2025-06-23T11:00:00.000Z",
      plannedMinutes: 30,
      actualMinutes: null,
      status: "pending",
    },
  ];
  await writeTasksToFile(testDataFilePath, tasks, "[]");

  const context: TaskContext = {
    dataFilePath: testDataFilePath,
    eventLogPath: testEventLogFilePath,
    timeLogPath: "",
  };

  // テスト実行
  await deleteTask("test-id-1", context);

  // 検証: タスクが1件だけ残っている
  const result = await readTasksFromFile(testDataFilePath);
  assertEquals(result.length, 1);
  assertEquals(result[0].id, "test-id-2");

  // イベントログが1行追加されていることも確認
  const eventLog = await Deno.readTextFile(testEventLogFilePath);
  const lines = eventLog.trim().split("\n");
  assertEquals(lines.length, 1);

  // 後片付け
  await Deno.remove(testDataFilePath);
  await Deno.remove(testEventLogFilePath);
});
