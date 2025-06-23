import { listTasks } from "../../commands/list.ts";
import { writeTasksToFile } from "../../utils/file.ts";
import { Task } from "../../types/task.ts";

// テスト用ファイルパス
const testDataFilePath = "./tests/commands/test_tasks.json";

// 標準出力をキャプチャするユーティリティ
function captureConsoleLog(fn: () => Promise<void>): Promise<string> {
  const originalLog = console.log;
  let output = "";
  console.log = (...args: unknown[]) => {
    output += args.join(" ") + "\n";
  };
  return fn().then(() => {
    console.log = originalLog;
    return output;
  });
}

Deno.test("listTasks: タスク一覧が正しく表示される", async () => {
  // 前準備: テスト用タスクを書き込み
  const tasks: Task[] = [
    {
      id: "testid01",
      title: "テストタスク1",
      createdAt: "2025-06-23T10:00:00.000Z",
      plannedMinutes: 60,
      actualMinutes: null,
      status: "pending",
    },
    {
      id: "testid02",
      title: "テストタスク2",
      createdAt: "2025-06-23T11:00:00.000Z",
      plannedMinutes: 30,
      actualMinutes: null,
      status: "completed",
    },
  ];
  await writeTasksToFile(testDataFilePath, tasks, "[]");

  // 標準出力をキャプチャしてlistTasksを実行
  const output = await captureConsoleLog(async () => {
    await listTasks(testDataFilePath);
  });

  // ヘッダーやタスクID・タイトルが出力に含まれていることを確認
  for (const task of tasks) {
    if (!output.includes(task.title)) {
      throw new Error(`出力にタスクタイトルが含まれていません: ${task.title}`);
    }
    if (!output.includes(task.id.slice(0, 8))) {
      throw new Error(
        `出力にタスクIDが含まれていません: ${task.id.slice(0, 8)}`,
      );
    }
  }

  // 後片付け
  await Deno.remove(testDataFilePath);
});
