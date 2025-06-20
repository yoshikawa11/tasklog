import {
  readJsonLines,
  readTasksFromFile,
  writeTasksToFile,
} from "../utils/file.ts";
import { Task } from "../types/task.ts";
import { createTaskStartEvent } from "../utils/eventLogFactory.ts";
import { saveLogEvent } from "../utils/logger.ts";
import { saveTimeLog } from "../utils/timeLogger.ts";
import { findTaskById } from "../utils/taskUtils.ts";
import { createStartEvent } from "../utils/timeLogFactory.ts";

export async function startTask(
  taskId: string,
  dataFilePath: string,
  eventLogPath: string,
  timeLogPath: string,
): Promise<void> {
  // 直近のstart/stopペアをチェック
  const logs = await readJsonLines(timeLogPath);
  const taskLogs = logs.filter((l) => l.taskId === taskId);
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

  const tasks: Task[] = await readTasksFromFile(dataFilePath);
  const task = findTaskById(tasks, taskId);
  if (!task) return;

  // タスクのステータスを開始中に設定
  task.status = "in_progress";

  // イベントログを記録
  const startTime = new Date().toISOString();

  await writeTasksToFile(dataFilePath, tasks, "[]");

  const event = createTaskStartEvent(task, startTime);
  await saveLogEvent(eventLogPath, event);

  // タイムログの保存
  const timeLog = createStartEvent(task);
  await saveTimeLog(timeLogPath, timeLog);
}
