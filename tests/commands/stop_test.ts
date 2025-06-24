import { assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { stopTask } from "../../commands/stop.ts";
import { writeTasksToFile } from "../../utils/file.ts";
import { Task } from "../../types/task.ts";

const testDataFilePath = "./tests/commands/test_tasks.json";
const testEventLogFilePath = "./tests/commands/test_eventlog.jsonl";
const testTimeLogFilePath = "./tests/commands/test_timelog.jsonl";

Deno.test("stopTask: start→stopでタイムログとイベントログが記録される", async () => {
  // 前準備: テスト用タスクとタイムログを初期化
  const task: Task = {
    id: "test-stop-id",
    title: "ストップテストタスク",
    createdAt: "2025-06-24T10:00:00.000Z",
    plannedMinutes: 60,
    actualMinutes: null,
    status: "in_progress",
  };
  await writeTasksToFile(testDataFilePath, [task], "[]");

  // 事前にstartイベントをタイムログに記録
  await Deno.writeTextFile(
    testTimeLogFilePath,
    JSON.stringify({
      event: "start",
      taskId: task.id,
      timestamp: "2025-06-24T10:00:00.000Z",
    }) + "\n",
  );

  // テスト実行
  await stopTask(
    task.id,
    testDataFilePath,
    testEventLogFilePath,
    testTimeLogFilePath,
  );

  // タイムログにstopイベントが追加されていることを確認
  const timeLogContent = await Deno.readTextFile(testTimeLogFilePath);
  const lines = timeLogContent.trim().split("\n");
  assertEquals(lines.length, 2);
  const stopLog = JSON.parse(lines[1]);
  assertEquals(stopLog.event, "stop");
  assertEquals(stopLog.taskId, task.id);

  // イベントログにstopイベントが記録されていることを確認
  const eventLogContent = await Deno.readTextFile(testEventLogFilePath);
  const eventLines = eventLogContent.trim().split("\n");
  assertEquals(eventLines.length, 1);
  const event = JSON.parse(eventLines[0]);
  assertEquals(event.type, "task:stop");
  assertEquals(event.taskId, task.id);

  // 後片付け
  await Deno.remove(testDataFilePath);
  await Deno.remove(testEventLogFilePath);
  await Deno.remove(testTimeLogFilePath);
});
