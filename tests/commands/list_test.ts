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
    await listTasks(testDataFilePath, {});
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

Deno.test("listTasks: statusフィルタでcompletedのみ表示される", async () => {
  const tasks: Task[] = [
    {
      id: "a1",
      title: "完了タスク",
      createdAt: "2025-06-23T10:00:00.000Z",
      plannedMinutes: 10,
      actualMinutes: 10,
      status: "completed",
    },
    {
      id: "a2",
      title: "未完了タスク",
      createdAt: "2025-06-23T11:00:00.000Z",
      plannedMinutes: 20,
      actualMinutes: null,
      status: "pending",
    },
  ];
  await writeTasksToFile(testDataFilePath, tasks, "[]");

  const output = await captureConsoleLog(async () => {
    await listTasks(testDataFilePath, { status: "completed" });
  });

  if (!output.includes("完了タスク")) {
    throw new Error("completedタスクが表示されていません");
  }
  if (output.includes("未完了タスク")) {
    throw new Error("pendingタスクが表示されています");
  }

  await Deno.remove(testDataFilePath);
});

Deno.test("listTasks: titleフィルタで部分一致したタスクのみ表示される", async () => {
  const tasks: Task[] = [
    {
      id: "b1",
      title: "開発作業",
      createdAt: "2025-06-23T10:00:00.000Z",
      plannedMinutes: 10,
      actualMinutes: 10,
      status: "completed",
    },
    {
      id: "b2",
      title: "レビュー",
      createdAt: "2025-06-23T11:00:00.000Z",
      plannedMinutes: 20,
      actualMinutes: null,
      status: "pending",
    },
  ];
  await writeTasksToFile(testDataFilePath, tasks, "[]");

  const output = await captureConsoleLog(async () => {
    await listTasks(testDataFilePath, { title: "開発" });
  });

  if (!output.includes("開発作業")) {
    throw new Error("titleフィルタで一致するタスクが表示されていません");
  }
  if (output.includes("レビュー")) {
    throw new Error("titleフィルタで一致しないタスクが表示されています");
  }

  await Deno.remove(testDataFilePath);
});

Deno.test("listTasks: plannedMinutesフィルタで指定以下のみ表示される", async () => {
  const tasks: Task[] = [
    {
      id: "c1",
      title: "短いタスク",
      createdAt: "2025-06-23T10:00:00.000Z",
      plannedMinutes: 10,
      actualMinutes: 10,
      status: "completed",
    },
    {
      id: "c2",
      title: "長いタスク",
      createdAt: "2025-06-23T11:00:00.000Z",
      plannedMinutes: 60,
      actualMinutes: null,
      status: "pending",
    },
  ];
  await writeTasksToFile(testDataFilePath, tasks, "[]");

  const output = await captureConsoleLog(async () => {
    await listTasks(testDataFilePath, { plannedMinutes: 20 });
  });

  if (!output.includes("短いタスク")) {
    throw new Error(
      "plannedMinutesフィルタで一致するタスクが表示されていません",
    );
  }
  if (output.includes("長いタスク")) {
    throw new Error(
      "plannedMinutesフィルタで一致しないタスクが表示されています",
    );
  }

  await Deno.remove(testDataFilePath);
});
