import { assertStringIncludes } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { main } from "../main.ts";

// main.tsのdefault: 未対応コマンドのテスト
Deno.test("main: 未対応コマンドの場合は案内が表示される", async () => {
  const originalConsoleLog = console.log;
  let output = "";
  console.log = (msg: string) => {
    output += msg;
  };

  const testArgs = {
    _: ["miss-command", "test task", 10],
    // 必要なオプションを追加
  };
  // main関数を直接呼び出し
  await main(testArgs);

  console.log = originalConsoleLog;
  assertStringIncludes(output, "未対応のコマンドです");
});
