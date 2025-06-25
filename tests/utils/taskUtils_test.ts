import { findTaskById } from "../../utils/taskUtils.ts";
import { Task } from "../../types/task.ts";

const tasks: Task[] = [
  {
    id: "abc123",
    title: "タスク1",
    createdAt: "2025-06-25T10:00:00.000Z",
    plannedMinutes: 30,
    actualMinutes: null,
    status: "pending",
  },
  {
    id: "abc456",
    title: "タスク2",
    createdAt: "2025-06-25T11:00:00.000Z",
    plannedMinutes: 60,
    actualMinutes: null,
    status: "completed",
  },
];

Deno.test("findTaskById: 完全一致でタスクが見つかる", () => {
  const result = findTaskById(tasks, "abc123");
  if (!result) throw new Error("タスクが見つかりません");
  if (result.id !== "abc123") throw new Error("IDが一致しません");
});

Deno.test("findTaskById: プレフィックス一致でタスクが見つかる", () => {
  const result = findTaskById(tasks, "abc4");
  if (!result) throw new Error("タスクが見つかりません");
  if (result.id !== "abc456") throw new Error("IDが一致しません");
});

Deno.test("findTaskById: 一致するタスクがない場合はnull", () => {
  const result = findTaskById(tasks, "notfound");
  if (result !== null) throw new Error("nullが返るべきです");
});

Deno.test("findTaskById: 複数一致する場合はnull", () => {
  const result = findTaskById(tasks, "abc");
  if (result !== null) throw new Error("nullが返るべきです（曖昧なID）");
});
