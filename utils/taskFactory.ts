import { Task } from "../types/task.ts";

export function createTask(title: string, plannedMinutes: number | null): Task {
  return {
    id: crypto.randomUUID(),
    title,
    createdAt: new Date().toISOString(),
    plannedMinutes,
    actualMinutes: null,
    status: "pending",
  };
}
