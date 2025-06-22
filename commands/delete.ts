import {
  ensureDataFile,
  readTasksFromFile,
  writeTasksToFile,
} from "../utils/file.ts";
import { findTaskById } from "../utils/taskUtils.ts";
import { createTaskDeleteEvent } from "../utils/eventLogFactory.ts";
import { saveLogEvent } from "../utils/logger.ts";
import { Task } from "../types/task.ts";

export async function deleteTask(
  taskId: string,
  dataFilePath: string,
  eventLogPath: string,
): Promise<void> {
  await ensureDataFile(dataFilePath, "[]");

  const tasks: Task[] = await readTasksFromFile(dataFilePath);
  const task = findTaskById(tasks, taskId);
  if (!task) return;

  const updatedTasks = tasks.filter((t) => t.id !== task.id);
  await writeTasksToFile(dataFilePath, updatedTasks, "[]");

  const event = createTaskDeleteEvent(task);
  await saveLogEvent(eventLogPath, event);
}
