import { Task } from "../types/task.ts";
import { TimeLog } from "../types/timeLog.ts";

export function createStartEvent(task: Task): TimeLog {
  return {
    event: "start",
    taskId: task.id,
    timestamp: new Date().toISOString(),
  };
}

export function createStopEvent(task: Task): TimeLog {
  return {
    event: "stop",
    taskId: task.id,
    timestamp: new Date().toISOString(),
  };
}
