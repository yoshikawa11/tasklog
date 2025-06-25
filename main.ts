import { parseArgs } from "https://deno.land/std@0.224.0/cli/parse_args.ts";
import { add } from "./commands/add.ts";
import { doneTask } from "./commands/done.ts";
import { listTasks } from "./commands/list.ts";
import { startTask } from "./commands/start.ts";
import { stopTask } from "./commands/stop.ts";
import { deleteTask } from "./commands/delete.ts";
import { clearTask } from "./commands/clear.ts";
import { dataFilePath, eventLogPath, timeLogPath } from "./utils/const.ts";

interface Args {
  _: (string | number)[];
  [key: string]: unknown; // 名前付きオプション引数
}

const args: Args = parseArgs(Deno.args);

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
      eventLogPath,
    ).catch((err) => {
      console.error("タスク追加中にエラーが発生しました:", err);
    });
    break;
  }
  case "list": {
    await listTasks(dataFilePath);
    break;
  }
  case "done": {
    await doneTask(
      String(args._[1]), // タスクIDを文字列として取得
      dataFilePath,
      eventLogPath,
      timeLogPath,
    ).catch((err) => {
      console.error("タスク完了中にエラーが発生しました:", err);
    });
    break;
  }
  case "start": {
    await startTask(
      String(args._[1]), // タスクIDを文字列として取得
      dataFilePath,
      eventLogPath,
      timeLogPath,
    ).catch((err) => {
      console.error("タスク開始中にエラーが発生しました:", err);
    });
    break;
  }
  case "stop": {
    await stopTask(
      String(args._[1]), // タスクIDを文字列として取得
      dataFilePath,
      eventLogPath,
      timeLogPath,
    ).catch((err) => {
      console.error("タスク開始中にエラーが発生しました:", err);
    });
    break;
  }
  case "delete": {
    await deleteTask(
      String(args._[1]), // タスクIDを文字列として取得
      dataFilePath,
      eventLogPath,
    ).catch((err) => {
      console.error("タスク削除中にエラーが発生しました:", err);
    });
    break;
  }
  case "clear": {
    await clearTask(dataFilePath, eventLogPath).catch((err) => {
      console.error("タスククリア中にエラーが発生しました:", err);
    });
    break;
  }

  default: {
    console.log("未対応のコマンドです");
  }
}
