import { assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { validateTaskId } from "../../utils/validation.ts";

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
