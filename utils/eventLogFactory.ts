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

export function createTaskDoneEvent(task: Task): EventLog {
  return {
    timestamp: new Date().toISOString(),
    type: "task:completed",
    taskId: task.id,
  };
}

export function createTaskStartEvent(
  task: Task,
  startTime: string,
): EventLog {
  return {
    timestamp: new Date().toISOString(),
    type: "task:start",
    taskId: task.id,
    payload: {
      startTime: startTime,
    },
  };
}

export function createTaskStopEvent(
  task: Task,
  stopTime: string,
): EventLog {
  return {
    timestamp: new Date().toISOString(),
    type: "task:stop",
    taskId: task.id,
    payload: {
      stopTime: stopTime,
    },
  };
}
