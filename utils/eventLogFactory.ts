import { Task } from "../types/task.ts";
import { EventLog } from "../types/eventLog.ts";

export function createTaskAddEvent(task: Task): EventLog {
  return {
    timestamp: new Date().toISOString(),
    type: "task:add",
    taskId: task.id,
    payload: {
      title: task.title,
      plannedMinutes: task.plannedMinutes,
    },
  };
}
