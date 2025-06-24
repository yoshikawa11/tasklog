import { assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { startTask } from "../../commands/start.ts";
import { readTasksFromFile, writeTasksToFile } from "../../utils/file.ts";
import { Task } from "../../types/task.ts";

const testDataFilePath = "./tests/commands/test_tasks.json";
const testEventLogFilePath = "./tests/commands/test_eventlog.jsonl";
const testTimeLogFilePath = "./tests/commands/test_timelog.jsonl";

Deno.test("startTask: タスク開始でイベント・タイムログが記録される", async () => {
  // 前準備: テスト用タスクを初期化
  const task: Task = {
    id: "test-start-id",
    title: "スタートテストタスク",
    createdAt: "2025-06-24T10:00:00.000Z",
    plannedMinutes: 60,
    actualMinutes: null,
    status: "pending",
  };
  await writeTasksToFile(testDataFilePath, [task], "[]");

  // テスト実行
  await startTask(
    task.id,
    testDataFilePath,
    testEventLogFilePath,
    testTimeLogFilePath,
  );

  // タスクのステータスが in_progress になっていることを確認
  const tasks = await readTasksFromFile(testDataFilePath);
  assertEquals(tasks[0].status, "in_progress");

  // イベントログにstartイベントが記録されていることを確認
  const eventLogContent = await Deno.readTextFile(testEventLogFilePath);
  const eventLines = eventLogContent.trim().split("\n");
  assertEquals(eventLines.length, 1);
  const event = JSON.parse(eventLines[0]);
  assertEquals(event.type, "task:start");
  assertEquals(event.taskId, task.id);

  // タイムログにstartイベントが記録されていることを確認
  const timeLogContent = await Deno.readTextFile(testTimeLogFilePath);
  const timeLines = timeLogContent.trim().split("\n");
  assertEquals(timeLines.length, 1);
  const timeLog = JSON.parse(timeLines[0]);
  assertEquals(timeLog.event, "start");
  assertEquals(timeLog.taskId, task.id);

  // 後片付け
  await Deno.remove(testDataFilePath);
  await Deno.remove(testEventLogFilePath);
  await Deno.remove(testTimeLogFilePath);
});
