import { Task } from "../types/task.ts";
import { Args } from "../types/args.ts";
import { TaskContext } from "../types/taskContext.ts";
import { ensureDataFile, writeTasksToFile } from "../utils/file.ts";
import { createTask } from "../utils/taskFactory.ts";
import { createTaskAddEvent } from "../utils/eventLogFactory.ts";
import { saveLogEvent } from "../utils/logger.ts";
import { defaultDataFileContent } from "../utils/const.ts";
import { handleError } from "../utils/helpers.ts";
import { validatePlannedMinutes, validateTitle } from "../utils/validation.ts";

export async function processAdd(
  args: Args,
  context: TaskContext,
): Promise<number> {
  const title = String(args._[1]);
  const plannedMinutes = args._[2] ? Number(args._[2]) : null;

  const titleError = validateTitle(title);
  if (titleError) {
    console.error(titleError);
    return 1;
  }
  const plannedMinutesError = validatePlannedMinutes(plannedMinutes);
  if (plannedMinutesError) {
    console.error(plannedMinutesError);
    return 1;
  }

  await addTask(
    title,
    plannedMinutes,
    context,
  ).catch((err) => {
    handleError("タスク追加")(err);
    return 1;
  });

  return 0;
}

export async function addTask(
  title: string,
  plannedMinutes: number | null,
  context: TaskContext,
): Promise<void> {
  await ensureDataFile(context.dataFilePath, defaultDataFileContent);

  let data: string;
  try {
    data = await Deno.readTextFile(context.dataFilePath);
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
  await writeTasksToFile(context.dataFilePath, tasks, defaultDataFileContent);
  console.log(`タスクを追加しました: ${newTask.title} (id: ${newTask.id})`);

  await ensureDataFile(context.eventLogPath, "");
  const event = createTaskAddEvent(newTask);
  await saveLogEvent(context.eventLogPath, event);
}
