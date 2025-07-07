import {
  readJsonLines,
  readTasksFromFile,
  writeTasksToFile,
} from "../utils/file.ts";
import { Task } from "../types/task.ts";
import { Args } from "../types/args.ts";
import { TaskContext } from "../types/taskContext.ts";
import { createTaskStopEvent } from "../utils/eventLogFactory.ts";
import { saveLogEvent } from "../utils/logger.ts";
import { saveTimeLog } from "../utils/timeLogger.ts";
import { findTaskById } from "../utils/taskUtils.ts";
import { createStopEvent } from "../utils/timeLogFactory.ts";
import { handleError } from "../utils/helpers.ts";
import { validateTaskId } from "../utils/validation.ts";

export async function processStop(
  args: Args,
  context: TaskContext,
): Promise<number> {
  const taskId = String(args._[1]);
  const error = validateTaskId(taskId);
  if (error) {
    console.error(error);
    return 1;
  }

  await stopTask(taskId, context).catch((err) => {
    handleError("タスク測定停止")(err);
    return 1;
  });

  return 0;
}

export async function stopTask(
  taskId: string,
  context: TaskContext,
): Promise<void> {
  const tasks: Task[] = await readTasksFromFile(context.dataFilePath);
  const task = findTaskById(tasks, taskId);
  if (!task) return;

  // 直近のstart/stopペアをチェック
  const logs = await readJsonLines(context.timeLogPath);
  const taskLogs = logs.filter((l) => l.taskId === task.id);
  let open = false;
  for (const log of taskLogs) {
    if (log.event === "start") open = true;
    if (log.event === "stop") open = false;
  }
  if (!open) {
    console.error(
      "このタスクは既に停止されています。startしてから再度stopしてください。",
    );
    return;
  }

  // イベントログを記録
  const stopTime = new Date().toISOString();

  await writeTasksToFile(context.dataFilePath, tasks, "[]");

  const event = createTaskStopEvent(task, stopTime);
  await saveLogEvent(context.eventLogPath, event);

  // タイムログの保存
  const timeLog = createStopEvent(task);
  await saveTimeLog(context.timeLogPath, timeLog);
}
