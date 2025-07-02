export enum Command {
  Add = "add",
  List = "list",
  Done = "done",
  Start = "start",
  Stop = "stop",
  Delete = "delete",
  Clear = "clear",
}
export interface ListOptions {
  status?: string;
  isOvertime?: boolean;
  title?: string;
  plannedMinutes?: number;
}
