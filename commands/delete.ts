import {
  ensureDataFile,
  readTasksFromFile,
  writeTasksToFile,
} from "../utils/file.ts";
import { findTaskById } from "../utils/taskUtils.ts";
import { createTaskDeleteEvent } from "../utils/eventLogFactory.ts";
import { saveLogEvent } from "../utils/logger.ts";
import { Task } from "../types/task.ts";
import { Args } from "../types/args.ts";
import { TaskContext } from "../types/taskContext.ts";
import { handleError } from "../utils/helpers.ts";
import { validateTaskId } from "../utils/validation.ts";

export async function processDelete(
  args: Args,
  context: TaskContext,
): Promise<number> {
  const taskId = String(args._[1]);
  const error = validateTaskId(taskId);
  if (error) {
    console.error(error);
    return 1;
  }

  await deleteTask(taskId, context).catch((err) => {
    handleError("タスクの削除")(err);
    return 1;
  });

  return 0;
}

export async function deleteTask(
  taskId: string,
  context: TaskContext,
): Promise<void> {
  await ensureDataFile(context.dataFilePath, "[]");

  const tasks: Task[] = await readTasksFromFile(context.dataFilePath);
  const task = findTaskById(tasks, taskId);
  if (!task) return;

  const updatedTasks = tasks.filter((t) => t.id !== task.id);
  await writeTasksToFile(context.dataFilePath, updatedTasks, "[]");

  const event = createTaskDeleteEvent(task);
  await saveLogEvent(context.eventLogPath, event);
}
