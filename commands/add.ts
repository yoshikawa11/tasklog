import { Task } from "../types/task.ts";
import { ensureDataFile, writeTasksToFile } from "../utils/file.ts";
import { createTask } from "../utils/taskFactory.ts";
import { createTaskAddEvent } from "../utils/eventLogFactory.ts";
import { saveLogEvent } from "../utils/logger.ts";

export async function add(
  title: string,
  plannedMinutes: number | null,
  dataFilePath: string,
  eventLogPath: string,
): Promise<void> {
  await ensureDataFile(dataFilePath, "[]");

  let data: string;
  try {
    data = await Deno.readTextFile(dataFilePath);
  } catch (err) {
    if (err instanceof Deno.errors.NotFound) {
      data = "[]";
    } else {
      throw err;
    }
  }

  const tasks: Task[] = JSON.parse(data);
  const newTask = createTask(title, plannedMinutes);
  tasks.push(newTask);
  await writeTasksToFile(dataFilePath, tasks);

  // TODO: logger.ts でログ記録を追加
  await ensureDataFile(eventLogPath, "");
  const event = createTaskAddEvent(newTask);
  await saveLogEvent(eventLogPath, event);
}
