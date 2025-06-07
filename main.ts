import { parseArgs } from "https://deno.land/std@0.224.0/cli/parse_args.ts";
import { add } from "./commands/add.ts";
import { dataFilePath } from "./utils/const.ts";

interface Args {
  _: (string | number)[];
  [key: string]: unknown; // 名前付きオプション引数
}

const args: Args = parseArgs(Deno.args);

// コマンドに応じて分岐（処理は未実装）
const command = args._[0];

switch (command) {
  case "add": {
    const title = String(args._[1]); // それぞれの型を明示する
    const plannedMinutes = args._[2] ? Number(args._[2]) : null;
    if (!title) {
      console.error("タイトルを指定してください");
      Deno.exit(1);
    }
    if (
      plannedMinutes !== null && isNaN(plannedMinutes) && plannedMinutes <= 0
    ) {
      console.error("予定時間は数値で指定してください");
      Deno.exit(1);
    }
    await add(
      title,
      plannedMinutes,
      dataFilePath,
    ).catch((err) => {
      console.error("タスク追加中にエラーが発生しました:", err);
    });
    break;
  }
  case "list": {
    break;
  }
  // 他のコマンドも同様に追加
  default: {
    console.log("未対応のコマンドです");
  }
}
