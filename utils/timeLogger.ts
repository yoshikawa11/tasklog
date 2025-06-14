import { ensureDataFile } from "./file.ts";

export async function saveTimeLog(
  filePath: string,
  timeLog: {
    event: string;
    taskId: string;
    timestamp: string;
  },
) {
  await ensureDataFile(filePath, "");
  await Deno.writeTextFile(filePath, JSON.stringify(timeLog) + "\n", {
    append: true,
  });
}
