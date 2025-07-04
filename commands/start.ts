import {
  readJsonLines,
  readTasksFromFile,
  writeTasksToFile,
} from "../utils/file.ts";
import { Task } from "../types/task.ts";
import { Args } from "../types/args.ts";
import { TaskContext } from "../types/taskContext.ts";
import { createTaskStartEvent } from "../utils/eventLogFactory.ts";
import { saveLogEvent } from "../utils/logger.ts";
import { saveTimeLog } from "../utils/timeLogger.ts";
import { findTaskById } from "../utils/taskUtils.ts";
import { createStartEvent } from "../utils/timeLogFactory.ts";

export async function processStart(
  args: Args,
  context: TaskContext,
): Promise<void> {
  const taskId = String(args._[1]);
  if (!taskId) {
    console.error("タスクIDを指定してください");
    return;
  }

  await startTask(taskId, context).catch((err) => {
    console.error("タスク開始中にエラーが発生しました:", err);
  });
}

export async function startTask(
  taskId: string,
  context: TaskContext,
): Promise<void> {
  const tasks: Task[] = await readTasksFromFile(context.dataFilePath);
  const task = findTaskById(tasks, taskId);
  if (!task) return;

  // 直近のstart/stopペアをチェック
  const logs = await readJsonLines(context.timeLogPath);
  const taskLogs = logs.filter((l) => l.taskId === task.id);
  let open = false;
  for (const log of taskLogs) {
    if (log.event === "start") open = true;
    if (log.event === "stop") open = false;
  }
  if (open) {
    console.error(
      "このタスクは既に開始されています。stopしてから再度startしてください。",
    );
    return;
  }

  // タスクのステータスを開始中に設定
  task.status = "in_progress";

  // イベントログを記録
  const startTime = new Date().toISOString();

  await writeTasksToFile(context.dataFilePath, tasks, "[]");

  const event = createTaskStartEvent(task, startTime);
  await saveLogEvent(context.eventLogPath, event);

  // タイムログの保存
  const timeLog = createStartEvent(task);
  await saveTimeLog(context.timeLogPath, timeLog);
}
