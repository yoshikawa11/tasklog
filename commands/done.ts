import { readTasksFromFile, writeTasksToFile } from "../utils/file.ts";
import { Task } from "../types/task.ts";
import { Args } from "../types/args.ts";
import { TaskContext } from "../types/taskContext.ts";
import { createTaskDoneEvent } from "../utils/eventLogFactory.ts";
import { saveLogEvent } from "../utils/logger.ts";
import { findTaskById } from "../utils/taskUtils.ts";
import { getActualMinutes } from "../utils/timeCalc.ts";
import { handleError } from "../utils/helpers.ts";
import { validateTaskId } from "../utils/validation.ts";

export async function processDone(
  args: Args,
  context: TaskContext,
): Promise<number> {
  const taskId = String(args._[1]);
  const error = validateTaskId(taskId);
  if (error) {
    console.error(error);
    return 1;
  }

  await doneTask(taskId, context).catch((err) => {
    handleError("タスク完了")(err);
    return 1;
  });

  return 0;
}

export async function doneTask(
  taskId: string,
  context: TaskContext,
): Promise<void> {
  const tasks: Task[] = await readTasksFromFile(context.dataFilePath);
  const task = findTaskById(tasks, taskId);
  if (!task) return;

  const actualMinutes = await getActualMinutes(task.id, context.timeLogPath);

  // taskの変更点をtasksにも反映
  const updatedTasks = tasks.map((t) =>
    t.id === task.id
      ? { ...t, status: "completed" as Task["status"], actualMinutes }
      : t
  );
  await writeTasksToFile(context.dataFilePath, updatedTasks, "[]");

  const event = createTaskDoneEvent({
    ...task,
    status: "completed",
    actualMinutes,
  });
  await saveLogEvent(context.eventLogPath, event);
}
