import { assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";
import {
  validatePlannedMinutes,
  validateTaskId,
  validateTitle,
} from "../../utils/validation.ts";

Deno.test("validateTaskId", async (t) => {
  await t.step("valid ID", () => {
    const result = validateTaskId("valid-id");
    assertEquals(result, null);
  });

  await t.step("invalid ID", () => {
    const result = validateTaskId("");
    assertEquals(result, "タスクIDを指定してください");
  });
});

Deno.test("validateTitle", async (t) => {
  await t.step("valid title", () => {
    const result = validateTitle("タイトル");
    assertEquals(result, null);
  });

  await t.step("empty title", () => {
    const result = validateTitle("");
    assertEquals(result, "タイトルを指定してください");
  });
});

Deno.test("validatePlannedMinutes", async (t) => {
  await t.step("valid number", () => {
    const result = validatePlannedMinutes(10);
    assertEquals(result, null);
  });

  await t.step("valid string number", () => {
    const result = validatePlannedMinutes("15");
    assertEquals(result, null);
  });

  await t.step("null or undefined", () => {
    assertEquals(validatePlannedMinutes(null), null);
    assertEquals(validatePlannedMinutes(undefined), null);
  });

  await t.step("invalid (zero)", () => {
    const result = validatePlannedMinutes(0);
    assertEquals(result, "予定時間は数値で指定してください");
  });

  await t.step("invalid (negative)", () => {
    const result = validatePlannedMinutes(-5);
    assertEquals(result, "予定時間は数値で指定してください");
  });

  await t.step("invalid (not a number)", () => {
    const result = validatePlannedMinutes("abc");
    assertEquals(result, "予定時間は数値で指定してください");
  });
});
