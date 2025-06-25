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

  const actualMinutes = await getActualMinutes(task.id, timeLogPath);

  // taskの変更点をtasksにも反映
  const updatedTasks = tasks.map((t) =>
    t.id === task.id
      ? { ...t, status: "completed" as Task["status"], actualMinutes }
      : t
  );
  await writeTasksToFile(dataFilePath, updatedTasks, "[]");

  const event = createTaskDoneEvent({
    ...task,
    status: "completed",
    actualMinutes,
  });
  await saveLogEvent(eventLogPath, event);
}
