export function validateTaskId(taskId: string): string | null {
  if (!taskId) {
    return "タスクIDを指定してください";
  }
  return null;
}

export function validateTitle(title: string): string | null {
  if (!title) return "タイトルを指定してください";
  return null;
}

export function validatePlannedMinutes(val: unknown): string | null {
  if (val === null || val === undefined) return null;
  const num = Number(val);
  if (isNaN(num) || num <= 0) return "予定時間は数値で指定してください";
  return null;
}
