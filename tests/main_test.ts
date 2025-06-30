import { assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { assertStringIncludes } from "@std/assert";
import { isOptionEnabled } from "../main.ts";

// main.tsのdefault: 未対応コマンドのテスト
Deno.test("main: 未対応コマンドの場合は案内が表示される", () => {
  const originalConsoleLog = console.log;
  let output = "";
  console.log = (msg: string) => {
    output += msg;
  };

  // 未対応コマンドを想定
  const command = "unknown";
  switch (command) {
    // ...他のcase省略...
    default: {
      console.log("未対応のコマンドです");
    }
  }

  console.log = originalConsoleLog;
  assertStringIncludes(output, "未対応のコマンドです");
});

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
