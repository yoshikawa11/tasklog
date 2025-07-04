import { clearTaskToFile, ensureDataFile } from "../utils/file.ts";
import { createTaskClearEvent } from "../utils/eventLogFactory.ts";
import { saveLogEvent } from "../utils/logger.ts";
import { TaskContext } from "../types/taskContext.ts";

export async function processClear(context: TaskContext): Promise<void> {
  await clearTask(context).catch((err) => {
    console.error("タスクの削除中にエラーが発生しました:", err);
  });
}

export async function clearTask(
  context: TaskContext,
): Promise<void> {
  await ensureDataFile(context.dataFilePath, "[]");

  await clearTaskToFile(context.dataFilePath);

  const event = createTaskClearEvent();
  await saveLogEvent(context.eventLogPath, event);
}
