export interface Task {
  id: string;
  title: string;
  createdAt: string; // ISO文字列
  plannedMinutes: number | null;
  actualMinutes: number | null;
  status: "pending" | "in_progress" | "completed";
}
