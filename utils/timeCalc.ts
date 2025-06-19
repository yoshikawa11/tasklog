import { readJsonLines } from "./file.ts";

export async function getActualMinutes(
  taskId: string,
  logPath: string,
): Promise<number> {
  const entries = await readJsonLines(logPath); // ログ全読み込み
  const pairs: [Date, Date][] = [];
  let currentStart: Date | null = null;

  for (const entry of entries) {
    if (entry.taskId !== taskId) continue;
    if (entry.event === "start") {
      currentStart = new Date(entry.timestamp);
    } else if (entry.event === "stop" && currentStart) {
      const end = new Date(entry.timestamp);
      pairs.push([currentStart, end]);
      currentStart = null;
    }
  }

  return Math.floor(
    pairs.reduce(
      (sum, [start, end]) => sum + (end.getTime() - start.getTime()),
      0,
    ) / 60000,
  );
}
