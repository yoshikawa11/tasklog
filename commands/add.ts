import { Task } from "../types/task.ts";
import { ensureDataFile, writeTasksToFile } from "../utils/file.ts";
import { createTask } from "../utils/taskFactory.ts";

export async function add(
  title: string,
  plannedMinutes: number | null,
  filePath: string,
): Promise<void> {
  await ensureDataFile(filePath, "[]");

  let data: string;
  try {
    data = await Deno.readTextFile(filePath);
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
  await writeTasksToFile(filePath, tasks);

  // TODO: logger.ts でログ記録を追加
}
