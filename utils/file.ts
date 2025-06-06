export async function ensureDataFile(filePath: string) {
  // ファイル存在チェック＆初期化
  try {
    await Deno.stat(filePath);
  } catch (err) {
    if (err instanceof Deno.errors.NotFound) {
      await Deno.writeTextFile(filePath, "[]");
    } else {
      throw err;
    }
  }
}
