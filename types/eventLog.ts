export type EventLog = {
  timestamp: string; // ISO 8601 (例: 2025-06-06T10:00:00Z)
  type: string; // "task:add", "task:update", "task:delete", etc.
  taskId?: string;
  payload?: Record<string, unknown>; // 任意の追加情報
};
