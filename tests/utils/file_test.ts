import { assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";
import {
  ensureDataFile,
  readJsonLines,
  readTasksFromFile,
  writeTasksToFile,
} from "../../utils/file.ts";
import { Task } from "../../types/task.ts";
import { TimeLog } from "../../types/timeLog.ts";

const testFilePath = "./tests/utils/test_tasks.json";
const testJsonlPath = "./tests/utils/test_timelog.jsonl";
const defaultContent = "[]";

Deno.test("ensureDataFile: ファイルが存在しない場合、初期化される", async () => {
  // 事前にファイルを削除
  try {
    await Deno.remove(testFilePath);
  } catch (_) {
    // donothing if file does not exist
  }

  await ensureDataFile(testFilePath, defaultContent);
  const content = await Deno.readTextFile(testFilePath);
  assertEquals(content, "[]");

  // 後片付け
  await Deno.remove(testFilePath);
});

Deno.test("ensureDataFile: ファイルが存在する場合、内容は変更されない", async () => {
  await Deno.writeTextFile(testFilePath, '[{"title":"test"}]');
  await ensureDataFile(testFilePath, defaultContent);
  const content = await Deno.readTextFile(testFilePath);
  assertEquals(content, '[{"title":"test"}]');

  // 後片付け
  await Deno.remove(testFilePath);
});

Deno.test("writeTasksToFile: タスク配列が正しく書き込まれる", async () => {
  const tasks: Task[] = [
    {
      "id": "ed091db3-9a22-41c0-978a-f5498514eda7",
      "title": "task1",
      "createdAt": "2025-06-07T09:32:01.833Z",
      "plannedMinutes": 120,
      "actualMinutes": null,
      "status": "pending",
    },
    {
      "id": "f2c2b5e4-5c5e-4c5e-8c5e-5c5e5c5e5c5e",
      "title": "new task",
      "createdAt": "2025-06-08T09:32:01.833Z",
      "plannedMinutes": 60,
      "actualMinutes": 120,
      "status": "in_progress",
    },
  ];

  await writeTasksToFile(testFilePath, tasks, defaultContent);
  const content = await Deno.readTextFile(testFilePath);
  const parsed: Task[] = JSON.parse(content);

  assertEquals(parsed.length, 2);
  assertEquals(parsed[0].title, "task1");
  assertEquals(parsed[1].plannedMinutes, 60);

  // 後片付け
  await Deno.remove(testFilePath);
});

Deno.test("readTasksFromFile: タスク配列が正しく読み込まれる", async () => {
  const tasks: Task[] = [
    {
      id: "1",
      title: "read test",
      createdAt: "2025-06-10T10:00:00.000Z",
      plannedMinutes: 45,
      actualMinutes: null,
      status: "pending",
    },
  ];
  await writeTasksToFile(testFilePath, tasks, "[]");

  const result = await readTasksFromFile(testFilePath);
  assertEquals(result.length, 1);
  assertEquals(result[0].title, "read test");

  // 後片付け
  await Deno.remove(testFilePath);
});

Deno.test("readTasksFromFile: ファイルが存在しない場合は空配列を返す", async () => {
  // 念のためファイルを削除
  try {
    await Deno.remove(testFilePath);
  } catch (_) {
    // do nothing if file does not exist
  }

  const result = await readTasksFromFile(testFilePath);
  assertEquals(result, []);
});

Deno.test("readJsonLines: JSONLファイルが正しく読み込まれる", async () => {
  const logs: TimeLog[] = [
    {
      event: "start",
      taskId: "abc",
      timestamp: "2025-06-24T10:00:00.000Z",
    },
    {
      event: "stop",
      taskId: "abc",
      timestamp: "2025-06-24T11:00:00.000Z",
    },
  ];
  // JSONL形式で書き込み
  await Deno.writeTextFile(
    testJsonlPath,
    logs.map((l) => JSON.stringify(l)).join("\n") + "\n",
  );

  const result = await readJsonLines(testJsonlPath);
  assertEquals(result.length, 2);
  assertEquals(result[0].event, "start");
  assertEquals(result[1].event, "stop");

  // 後片付け
  await Deno.remove(testJsonlPath);
});

Deno.test("readJsonLines: ファイルが存在しない場合は空配列を返す", async () => {
  // 念のためファイルを削除
  try {
    await Deno.remove(testJsonlPath);
  } catch (_) {}

  const result = await readJsonLines(testJsonlPath);
  assertEquals(result, []);
});
