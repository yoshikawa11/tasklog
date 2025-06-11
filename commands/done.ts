import { readTasksFromFile, writeTasksToFile } from "../utils/file.ts";
import { Task } from "../types/task.ts";
import { createTaskDoneEvent } from "../utils/eventLogFactory.ts";
import { saveLogEvent } from "../utils/logger.ts";

export async function doneTask(
  taskId: string,
  dataFilePath: string,
  eventLogPath: string,
): Promise<void> {
  const tasks: Task[] = await readTasksFromFile(dataFilePath);
  const matches = tasks.filter((t) => t.id.startsWith(taskId));
  if (matches.length === 0) {
    console.error("タスクが見つかりません");
  } else if (matches.length > 1) {
    console.error(
      "曖昧なIDです。一致したタスク:",
      matches.map((t) => `${t.id} | ${t.title}`),
    );
  } else {
    const task = matches[0];
    if (!task) {
      console.error("タスクが見つかりません");
      Deno.exit(1);
    }
    // todo: 実際の時間を計測して値を設定する
    task.status = "completed";
    await writeTasksToFile(dataFilePath, tasks, "[]");

    const event = createTaskDoneEvent(task);
    await saveLogEvent(eventLogPath, event);
  }
}
