import {
  readJsonLines,
  readTasksFromFile,
  writeTasksToFile,
} from "../utils/file.ts";
import { Task } from "../types/task.ts";
import { createTaskStopEvent } from "../utils/eventLogFactory.ts";
import { saveLogEvent } from "../utils/logger.ts";
import { saveTimeLog } from "../utils/timeLogger.ts";
import { findTaskById } from "../utils/taskUtils.ts";
import { createStopEvent } from "../utils/timeLogFactory.ts";

export async function stopTask(
  taskId: string,
  dataFilePath: string,
  eventLogPath: string,
  timeLogPath: string,
): Promise<void> {
  const tasks: Task[] = await readTasksFromFile(dataFilePath);
  const task = findTaskById(tasks, taskId);
  if (!task) return;

  // 直近のstart/stopペアをチェック
  const logs = await readJsonLines(timeLogPath);
  const taskLogs = logs.filter((l) => l.taskId === task.id);
  let open = false;
  for (const log of taskLogs) {
    if (log.event === "start") open = true;
    if (log.event === "stop") open = false;
  }
  if (!open) {
    console.error(
      "このタスクは既に停止されています。startしてから再度stopしてください。",
    );
    return;
  }

  // イベントログを記録
  const stopTime = new Date().toISOString();

  await writeTasksToFile(dataFilePath, tasks, "[]");

  const event = createTaskStopEvent(task, stopTime);
  await saveLogEvent(eventLogPath, event);

  // タイムログの保存
  const timeLog = createStopEvent(task);
  await saveTimeLog(timeLogPath, timeLog);
}
