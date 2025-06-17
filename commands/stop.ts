import { readTasksFromFile, writeTasksToFile } from "../utils/file.ts";
import { Task } from "../types/task.ts";
import { createTaskStartEvent } from "../utils/eventLogFactory.ts";
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

  // タスクのステータスを開始中に設定
  task.status = "completed";

  // タイムログを記録
  const startTime = new Date().toISOString();

  await writeTasksToFile(dataFilePath, tasks, "[]");

  const event = createTaskStartEvent(task, startTime);
  await saveLogEvent(eventLogPath, event);

  // タイムログの保存
  const timeLog = createStopEvent(task);
  await saveTimeLog(timeLogPath, timeLog);
}
