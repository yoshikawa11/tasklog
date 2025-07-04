import { assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { isOptionEnabled, handleError } from "../../utils/helpers.ts";

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

Deno.test("handleError: エラー内容と文脈がconsole.errorに出力される", () => {
  const originalConsoleError = console.error;
  let output = "";
  console.error = (msg: string, err: unknown) => {
    output += msg + String(err);
  };

  const handler = handleError("テスト処理");
  handler(new Error("テストエラー"));

  console.error = originalConsoleError;
  // 文脈とエラー内容が含まれているかを確認
  assertEquals(output.includes("テスト処理中にエラーが発生しました:"), true);
  assertEquals(output.includes("テストエラー"), true);
});


