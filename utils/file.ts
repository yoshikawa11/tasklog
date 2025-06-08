import { Task } from "../types/task.ts";

export async function ensureDataFile(filePath: string, defaultContent: string) {
  // ファイル存在チェック＆初期化
  try {
    await Deno.stat(filePath);
  } catch (err) {
    if (err instanceof Deno.errors.NotFound) {
      await Deno.writeTextFile(filePath, defaultContent);
    } else {
      throw err;
    }
  }
}

export async function writeTasksToFile(filePath: string, tasks: Task[]) {
  await Deno.writeTextFile(filePath, JSON.stringify(tasks, null, 2));
}
