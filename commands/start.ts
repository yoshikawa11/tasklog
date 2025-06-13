import { readTasksFromFile, writeTasksToFile } from "../utils/file.ts";
import { Task } from "../types/task.ts";
import { createTaskStartEvent } from "../utils/eventLogFactory.ts";
import { saveLogEvent } from "../utils/logger.ts";

export async function startTask(
  taskId: string,
  dataFilePath: string,
  eventLogPath: string,
  timeLogPath: string,
): Promise<void> {
  const tasks: Task[] = await readTasksFromFile(dataFilePath);
  const matches = tasks.filter((t) => t.id.startsWith(taskId));

  if (matches.length === 0) {
    console.error("タスクが見つかりません");
    return;
  } else if (matches.length > 1) {
    console.error(
      "曖昧なIDです。一致したタスク:",
      matches.map((t) => `${t.id} | ${t.title}`),
    );
    return;
  }

  const task = matches[0];
  if (!task) {
    console.error("タスクが見つかりません");
    return;
  }

  // タスクのステータスを開始中に設定
  task.status = "in_progress";

  // タイムログを記録
  const startTime = new Date().toISOString();

  await writeTasksToFile(dataFilePath, tasks, "[]");

  const event = createTaskStartEvent(task, startTime);
  await saveLogEvent(eventLogPath, event);

  // タイムログの保存
  await saveTimeLog(timeLogPath, task.id, startTime);
}
