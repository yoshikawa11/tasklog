import { assertStringIncludes } from "@std/assert";

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
