import { readTasksFromFile, writeTasksToFile } from "../utils/file.ts";
import { Task } from "../types/task.ts";
import { createTaskDoneEvent } from "../utils/eventLogFactory.ts";
import { saveLogEvent } from "../utils/logger.ts";
import { findTaskById } from "../utils/taskUtils.ts";
import { getActualMinutes } from "../utils/timeCalc.ts";

export async function doneTask(
  taskId: string,
  dataFilePath: string,
  eventLogPath: string,
  timeLogPath: string,
): Promise<void> {
  const tasks: Task[] = await readTasksFromFile(dataFilePath);
  const task = findTaskById(tasks, taskId);
  if (!task) return;

  task.status = "completed";
  task.actualMinutes = await getActualMinutes(taskId, timeLogPath);
  await writeTasksToFile(dataFilePath, tasks, "[]");

  const event = createTaskDoneEvent(task);
  await saveLogEvent(eventLogPath, event);
}
