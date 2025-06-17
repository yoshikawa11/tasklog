import { Task } from "../types/task.ts";

export function findTaskById(tasks: Task[], taskId: string): Task | null {
  const matches = tasks.filter((t) => t.id.startsWith(taskId));
  if (matches.length === 0) {
    console.error("タスクが見つかりません");
    return null;
  } else if (matches.length > 1) {
    console.error(
      "曖昧なIDです。一致したタスク:",
      matches.map((t) => `${t.id} | ${t.title}`),
    );
    return null;
  }
  return matches[0];
}
