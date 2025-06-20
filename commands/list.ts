import { Task } from "../types/task.ts";
import { timeLogPath } from "../utils/const.ts";
import { readTasksFromFile } from "../utils/file.ts";
import { getActualMinutes } from "../utils/timeCalc.ts";
// esm.sh CDN から string-width を取得
import stringWidth from "https://esm.sh/string-width@7"; // 最新版7.xを使用

function padDisplay(str: string, width: number): string {
  const displayWidth = stringWidth(str);
  return str + " ".repeat(Math.max(0, width - displayWidth));
}

export async function listTasks(dataFilePath: string): Promise<void> {
  const tasks: Task[] = await readTasksFromFile(dataFilePath);

  const headers = ["ID", "Title", "Planned", "Actual", "Status"];
  const colWidths = [8, 30, 10, 10, 8];

  const headerLine = headers.map((h, i) => padDisplay(h, colWidths[i])).join(
    " | ",
  );
  const separator = colWidths.map((w) => "-".repeat(w)).join("-+-");

  console.log(headerLine);
  console.log(separator);

  for (const task of tasks) {
    const row = [
      padDisplay(task.id.slice(0, 8), colWidths[0]),
      padDisplay(task.title, colWidths[1]),
      padDisplay(`${task.plannedMinutes} min`, colWidths[2]),
      padDisplay(
        await getActualMinutes(task.id, timeLogPath) !== null
          ? `${await getActualMinutes(task.id, timeLogPath)} min`
          : "-",
        colWidths[3],
      ),
      padDisplay(task.status, colWidths[4]),
    ].join(" | ");

    console.log(row);
  }
}
