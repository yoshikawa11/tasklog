import { parseArgs } from "https://deno.land/std@0.224.0/cli/parse_args.ts";

interface Args {
  _: (string | number)[];
  [key: string]: unknown;
}

const args: Args = parseArgs(Deno.args);

// コマンドに応じて分岐（処理は未実装）
const command = args._[0];

switch (command) {
  case "add":
    // import("./commands/add.ts") などで動的にロード予定
    console.log("addコマンドが呼び出されました");

    break;
  case "list":
    break;
  // 他のコマンドも同様に追加
  default:
    console.log("未対応のコマンドです");
}
