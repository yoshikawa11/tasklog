import { ListOptions } from "./commands.ts";
import { Args } from "../types/args.ts";
import { Task } from "../types/task.ts";
import { readTasksFromFile } from "../utils/file.ts";
import { getActualMinutes } from "../utils/timeCalc.ts";
import { handleError, isOptionEnabled } from "../utils/helpers.ts";
import stringWidth from "https://esm.sh/string-width@7.2.0?dts";
import { TaskContext } from "../types/taskContext.ts";

function padDisplay(str: string, width: number): string {
  const displayWidth = stringWidth(str);
  return str + " ".repeat(Math.max(0, width - displayWidth));
}

function truncate(str: string, max: number): string {
  let result = "";
  let w = 0;
  for (const ch of str) {
    const chWidth = stringWidth(ch);
    if (w + chWidth > max - 1) break;
    result += ch;
    w += chWidth;
  }
  if (stringWidth(str) > max) result += "…";
  return result;
}

export async function processList(
  args: Args,
  context: TaskContext,
): Promise<void> {
  const isOvertime = isOptionEnabled(args.isOvertime);
  await listTasks({
    dataFilePath: context.dataFilePath,
    timeLogPath: context.timeLogPath,
    status: args.status as string | undefined,
    isOvertime,
    title: args.title as string | undefined,
    plannedMinutes: args.plannedMinutes as number | undefined,
  }).catch(handleError("タスクの一覧取得"));
}

export async function listTasks(
  options: ListOptions & { dataFilePath: string; timeLogPath: string },
): Promise<void> {
  const { dataFilePath, timeLogPath, ...filters } = options;
  const tasks: Task[] = await readTasksFromFile(dataFilePath);

  // statusがカンマ区切りの場合に配列化
  let statusList: string[] | undefined = undefined;
  if (filters.status) {
    statusList = filters.status.split(",").map((s) => s.trim()).filter((s) =>
      s.length > 0
    );
  }

  const filtered: Task[] = [];
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
    if (filters.isOvertime) {
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

  // ターミナルの幅を取得（デフォルト80カラム）
  let terminalWidth = 80;
  try {
    terminalWidth = Deno.consoleSize().columns;
  } catch {
    // 取得できない場合は80
  }

  // 各列の幅を決定
  const colWidths = [8, 10, 10, 10, 12];
  const fixedWidth = colWidths.reduce((a, b) => a + b, 0) + 4 * 3;
  const titleWidth = Math.max(20, terminalWidth - fixedWidth);
  const finalColWidths = [8, titleWidth, 10, 10, 12];

  const headers = ["ID", "Title", "Planned", "Actual", "Status"];
  const headerLine = headers.map((h, i) => padDisplay(h, finalColWidths[i]))
    .join(" | ");
  const separator = finalColWidths.map((w) => "-".repeat(w)).join("-+-");

  console.log(headerLine);
  console.log(separator);

  for (const task of filtered) {
    const row = [
      padDisplay(task.id.slice(0, 8), finalColWidths[0]),
      padDisplay(truncate(task.title, titleWidth), finalColWidths[1]),
      padDisplay(`${task.plannedMinutes} min`, finalColWidths[2]),
      padDisplay(
        task.status !== "pending" || task.actualMinutes !== null
          ? `${await getActualMinutes(task.id, timeLogPath)} min`
          : "-",
        finalColWidths[3],
      ),
      padDisplay(task.status, finalColWidths[4]),
    ].join(" | ");
    console.log(row);
  }
}
