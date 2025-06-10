import { assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { saveLogEvent } from "../../utils/logger.ts";
import { EventLog } from "../../types/eventLog.ts";

const testLogPath = "./tests/utils/test_eventlog.jsonl";

Deno.test("saveLogEvent: EventLog型のイベントが1行で追記される", async () => {
  // 前準備: テスト用ログファイルを削除
  try {
    await Deno.remove(testLogPath);
  } catch (_) {
    // do nothing if file does not exist
  }

  const event: EventLog = {
    timestamp: "2025-06-09T12:00:00Z",
    type: "task:add",
    taskId: "abc123",
    payload: { title: "test task", plannedMinutes: 30 },
  };

  await saveLogEvent(testLogPath, event);

  const content = await Deno.readTextFile(testLogPath);
  const lines = content.trim().split("\n");
  assertEquals(lines.length, 1);

  const parsed: EventLog = JSON.parse(lines[0]);
  assertEquals(parsed.type, "task:add");
  assertEquals(parsed.taskId, "abc123");
  assertEquals(parsed.payload?.title, "test task");
  assertEquals(parsed.payload?.plannedMinutes, 30);

  // 後片付け
  await Deno.remove(testLogPath);
});
