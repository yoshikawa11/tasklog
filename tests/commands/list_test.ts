import { listTasks } from "../../commands/list.ts";
import { writeTasksToFile } from "../../utils/file.ts";
import { Task } from "../../types/task.ts";

// テスト用ファイルパス
const testDataFilePath = "./tests/commands/test_tasks.json";
const testTimeLogPath = "./tests/commands/test_timelog.jsonl";

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
    await listTasks({ dataFilePath: testDataFilePath, timeLogPath: testTimeLogPath });
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
    await listTasks({
      dataFilePath: testDataFilePath,
      timeLogPath: testTimeLogPath,
      status: "completed",
    });
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
    await listTasks({ 
      dataFilePath: testDataFilePath,
      timeLogPath: testTimeLogPath,
      title: "開発",
    });
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
    await listTasks({ 
      dataFilePath: testDataFilePath,
      timeLogPath: testTimeLogPath,
      plannedMinutes: 20
    });
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

Deno.test("listTasks: isOvertimeフィルタで予定超過タスクのみ表示される", async () => {
  // 予定時間を超過したタスクと、超過していないタスクを用意
  const tasks: Task[] = [
    {
      id: "ot1",
      title: "超過タスク",
      createdAt: "2025-06-23T10:00:00.000Z",
      plannedMinutes: 30,
      actualMinutes: null,
      status: "completed",
    },
    {
      id: "ot2",
      title: "未超過タスク",
      createdAt: "2025-06-23T11:00:00.000Z",
      plannedMinutes: 60,
      actualMinutes: null,
      status: "completed",
    },
  ];
  await writeTasksToFile(testDataFilePath, tasks, "[]");

  // タイムログを作成（ot1は40分、ot2は30分）
  const timeLogs = [
    { event: "start", taskId: "ot1", timestamp: "2025-06-23T10:00:00.000Z" },
    { event: "stop", taskId: "ot1", timestamp: "2025-06-23T10:40:00.000Z" },
    { event: "start", taskId: "ot2", timestamp: "2025-06-23T11:00:00.000Z" },
    { event: "stop", taskId: "ot2", timestamp: "2025-06-23T11:30:00.000Z" },
  ];
  const testTimeLogPath = "./tests/commands/test_timelog.jsonl";
  await Deno.writeTextFile(
    testTimeLogPath,
    timeLogs.map((l) => JSON.stringify(l)).join("\n") + "\n",
  );

  try {
    const output = await captureConsoleLog(async () => {
      await listTasks({ 
        dataFilePath: testDataFilePath,
        timeLogPath: testTimeLogPath,
        isOvertime: true
      });
    });

    // 検証
    if (!output.includes("超過タスク")) {
      throw new Error("isOvertimeフィルタで超過タスクが表示されていません");
    }
    if (output.includes("未超過タスク")) {
      throw new Error("isOvertimeフィルタで未超過タスクが表示されています");
    }
  } finally {
    // 後片付け
    await Deno.remove(testDataFilePath);
    await Deno.remove(testTimeLogPath);
  }
});
