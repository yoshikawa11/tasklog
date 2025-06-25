import { assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { getActualMinutes } from "../../utils/timeCalc.ts";

const testLogPath = "./tests/utils/test_timelog.jsonl";

Deno.test("getActualMinutes: start/stopペアで正しい分数が計算される", async () => {
  // 60分のペア
  const logs = [
    {
      event: "start",
      taskId: "task1",
      timestamp: "2025-06-25T10:00:00.000Z",
    },
    {
      event: "stop",
      taskId: "task1",
      timestamp: "2025-06-25T11:00:00.000Z",
    },
  ];
  await Deno.writeTextFile(
    testLogPath,
    logs.map((l) => JSON.stringify(l)).join("\n") + "\n",
  );

  const minutes = await getActualMinutes("task1", testLogPath);
  assertEquals(minutes, 60);

  await Deno.remove(testLogPath);
});

Deno.test("getActualMinutes: 複数ペアも合計される", async () => {
  // 30分 + 45分 = 75分
  const logs = [
    {
      event: "start",
      taskId: "task2",
      timestamp: "2025-06-25T09:00:00.000Z",
    },
    {
      event: "stop",
      taskId: "task2",
      timestamp: "2025-06-25T09:30:00.000Z",
    },
    {
      event: "start",
      taskId: "task2",
      timestamp: "2025-06-25T10:00:00.000Z",
    },
    {
      event: "stop",
      taskId: "task2",
      timestamp: "2025-06-25T10:45:00.000Z",
    },
  ];
  await Deno.writeTextFile(
    testLogPath,
    logs.map((l) => JSON.stringify(l)).join("\n") + "\n",
  );

  const minutes = await getActualMinutes("task2", testLogPath);
  assertEquals(minutes, 75);

  await Deno.remove(testLogPath);
});

Deno.test("getActualMinutes: stopがない場合は未完了分はカウントしない", async () => {
  // startのみ
  const logs = [
    {
      event: "start",
      taskId: "task3",
      timestamp: "2025-06-25T12:00:00.000Z",
    },
  ];
  await Deno.writeTextFile(
    testLogPath,
    logs.map((l) => JSON.stringify(l)).join("\n") + "\n",
  );

  const minutes = await getActualMinutes("task3", testLogPath);
  assertEquals(minutes, 0);

  await Deno.remove(testLogPath);
});
