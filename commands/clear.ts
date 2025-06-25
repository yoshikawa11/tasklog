import { clearTaskToFile, ensureDataFile } from "../utils/file.ts";
import { createTaskClearEvent } from "../utils/eventLogFactory.ts";
import { saveLogEvent } from "../utils/logger.ts";

export async function clearTask(
  dataFilePath: string,
  eventLogPath: string,
): Promise<void> {
  await ensureDataFile(dataFilePath, "[]");

  await clearTaskToFile(dataFilePath);

  const event = createTaskClearEvent();
  await saveLogEvent(eventLogPath, event);
}
