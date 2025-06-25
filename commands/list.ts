import { Task } from "../types/task.ts";
import { timeLogPath } from "../utils/const.ts";
import { readTasksFromFile } from "../utils/file.ts";
import { getActualMinutes } from "../utils/timeCalc.ts";
// esm.sh CDN から string-width を取得
import stringWidth from "https://esm.sh/string-width@7"; // 最新版7.xを使用

interface ListOptions {
  status?: string;
  overtime?: boolean;
  title?: string;
  plannedMinutes?: number;
}

function padDisplay(str: string, width: number): string {
  const displayWidth = stringWidth(str);
  return str + " ".repeat(Math.max(0, width - displayWidth));
}

export async function listTasks(
  dataFilePath: string,
  filters: ListOptions,
): Promise<void> {
  const tasks: Task[] = await readTasksFromFile(dataFilePath);

  // statusがカンマ区切りの場合に配列化
  let statusList: string[] | undefined = undefined;
  if (filters.status) {
    statusList = filters.status.split(",").map((s) => s.trim()).filter((s) =>
      s.length > 0
    );
  }

  const filtered: Task[] = [];
  const isOvertime = toBoolean(filters.overtime);

  for (const task of tasks) {
    if (statusList && !statusList.includes(task.status)) continue;
    if (filters.title && !task.title.includes(filters.title)) continue;
    if (
      filters.plannedMinutes !== undefined &&
      task.plannedMinutes !== null &&
      task.plannedMinutes > filters.plannedMinutes
    ) {
      continue;
    }
    if (isOvertime) {
      if (task.plannedMinutes === null) continue;
      const actualMinutes = await getActualMinutes(task.id, timeLogPath);
      if (actualMinutes <= task.plannedMinutes) continue;
    }
    filtered.push(task);
  }

  if (filtered.length === 0) {
    console.log("タスクが見つかりませんでした");
    return;
  }

  const headers = ["ID", "Title", "Planned", "Actual", "Status"];
  const colWidths = [8, 30, 10, 10, 8];

  const headerLine = headers.map((h, i) => padDisplay(h, colWidths[i])).join(
    " | ",
  );
  const separator = colWidths.map((w) => "-".repeat(w)).join("-+-");

  console.log(headerLine);
  console.log(separator);

  for (const task of filtered) {
    const row = [
      padDisplay(task.id.slice(0, 8), colWidths[0]),
      padDisplay(task.title, colWidths[1]),
      padDisplay(`${task.plannedMinutes} min`, colWidths[2]),
      padDisplay(
        task.status !== "pending" || task.actualMinutes !== null
          ? `${await getActualMinutes(task.id, timeLogPath)} min`
          : "-",
        colWidths[3],
      ),
      padDisplay(task.status, colWidths[4]),
    ].join(" | ");

    console.log(row);
  }
}

function toBoolean(val: unknown): boolean {
  if (val === true || val === "true") return true;
  if (val === false || val === "false") return false;
  return Boolean(val);
}
