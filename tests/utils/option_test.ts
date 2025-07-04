import { assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { isOptionEnabled } from "../../utils/option.ts";

Deno.test("isOptionEnabled: trueを判定", () => {
  assertEquals(isOptionEnabled(true), true);
  assertEquals(isOptionEnabled("true"), true);
  assertEquals(isOptionEnabled(""), true); // --option のみ指定時
});

Deno.test("isOptionEnabled: falseや未指定を判定", () => {
  assertEquals(isOptionEnabled(false), false);
  assertEquals(isOptionEnabled("false"), false);
  assertEquals(isOptionEnabled(undefined), false);
  assertEquals(isOptionEnabled(null), false);
  assertEquals(isOptionEnabled(0), false);
});
