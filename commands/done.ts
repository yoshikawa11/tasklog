import { readTasksFromFile, writeTasksToFile } from "../utils/file.ts";
import { Task } from "../types/task.ts";
import { createTaskDoneEvent } from "../utils/eventLogFactory.ts";
import { saveLogEvent } from "../utils/logger.ts";
import { findTaskById } from "../utils/taskUtils.ts";

export async function doneTask(
  taskId: string,
  dataFilePath: string,
  eventLogPath: string,
): Promise<void> {
  const tasks: Task[] = await readTasksFromFile(dataFilePath);
  const task = findTaskById(tasks, taskId);
  if (!task) return;

  // todo: 実際の時間を計測して値を設定する
  task.status = "completed";
  await writeTasksToFile(dataFilePath, tasks, "[]");

  const event = createTaskDoneEvent(task);
  await saveLogEvent(eventLogPath, event);
}
