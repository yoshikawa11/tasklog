import { Task } from "../types/task.ts";
import { Args } from "../types/args.ts";
import { ensureDataFile, writeTasksToFile } from "../utils/file.ts";
import { createTask } from "../utils/taskFactory.ts";
import { createTaskAddEvent } from "../utils/eventLogFactory.ts";
import { saveLogEvent } from "../utils/logger.ts";
import { defaultDataFileContent } from "../utils/const.ts";

export async function processAdd(args: Args): Promise<void> {
  const title = String(args._[1]);
  const plannedMinutes = args._[2] ? Number(args._[2]) : null;

  if (!title) {
    console.error("タイトルを指定してください");
    Deno.exit(1);
  }
  if (
    plannedMinutes !== null && isNaN(plannedMinutes) && plannedMinutes <= 0
  ) {
    console.error("予定時間は数値で指定してください");
    Deno.exit(1);
  }

  await addTask(
    title,
    plannedMinutes,
    args.dataFilePath as string,
    args.eventLogPath as string,
  ).catch((err) => {
    console.error("タスク追加中にエラーが発生しました:", err);
  });
}

export async function addTask(
  title: string,
  plannedMinutes: number | null,
  dataFilePath: string,
  eventLogPath: string,
): Promise<void> {
  await ensureDataFile(dataFilePath, defaultDataFileContent);

  let data: string;
  try {
    data = await Deno.readTextFile(dataFilePath);
  } catch (err) {
    if (err instanceof Deno.errors.NotFound) {
      data = defaultDataFileContent;
    } else {
      throw err;
    }
  }

  const tasks: Task[] = JSON.parse(data);
  const newTask = createTask(title, plannedMinutes);
  tasks.push(newTask);
  await writeTasksToFile(dataFilePath, tasks, defaultDataFileContent);
  console.log(`タスクを追加しました: ${newTask.title} (id: ${newTask.id})`);

  await ensureDataFile(eventLogPath, "");
  const event = createTaskAddEvent(newTask);
  await saveLogEvent(eventLogPath, event);
}
