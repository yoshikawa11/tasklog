import { Task } from "../types/task.ts";
import { TimeLog } from "../types/timeLog.ts";

export async function ensureDataFile(filePath: string, defaultContent: string) {
  // ファイル存在チェック＆初期化
  try {
    await Deno.stat(filePath);
  } catch (err) {
    if (err instanceof Deno.errors.NotFound) {
      // ディレクトリが存在しない場合は作成
      const dir = filePath.substring(0, filePath.lastIndexOf("/"));
      if (dir) {
        try {
          await Deno.mkdir(dir, { recursive: true });
        } catch (e) {
          // 既に存在する場合は無視
          if (!(e instanceof Deno.errors.AlreadyExists)) throw e;
        }
      }
      await Deno.writeTextFile(filePath, defaultContent);
    } else {
      throw err;
    }
  }
}

export async function writeTasksToFile(
  filePath: string,
  tasks: Task[],
  defaultContent: string,
) {
  await ensureDataFile(filePath, defaultContent);
  await Deno.writeTextFile(filePath, JSON.stringify(tasks, null, 2));
}

export async function readTasksFromFile(filePath: string): Promise<Task[]> {
  try {
    const data = await Deno.readTextFile(filePath);
    return JSON.parse(data) as Task[];
  } catch (_err) {
    return [];
  }
}

export async function readJsonLines(filePath: string): Promise<TimeLog[]> {
  try {
    const text = await Deno.readTextFile(filePath);
    return text
      .split("\n")
      .filter((line) => line.trim().length > 0)
      .map((line) => JSON.parse(line));
  } catch (err) {
    if (err instanceof Deno.errors.NotFound) {
      return [];
    }
    throw err;
  }
}

export async function clearTaskToFile(filePath: string): Promise<void> {
  await Deno.writeTextFile(filePath, "[]");
}
