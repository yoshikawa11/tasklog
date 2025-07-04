import { parseArgs } from "jsr:@std/cli/parse-args";
import { processAdd } from "./commands/add.ts";
import { processDone } from "./commands/done.ts";
import { processList } from "./commands/list.ts";
import { startTask } from "./commands/start.ts";
import { stopTask } from "./commands/stop.ts";
import { deleteTask } from "./commands/delete.ts";
import { clearTask } from "./commands/clear.ts";
import {
  dataFilePath,
  eventLogPath,
  timeLogPath,
  version,
} from "./utils/const.ts";
import { Command } from "./commands/commands.ts";
import { Args } from "./types/args.ts";
import { TaskContext } from "./types/taskContext.ts";

export async function main(args: Args): Promise<number> {
  const command = typeof args._[0] === "string"
    ? (args._[0] as string).toLowerCase()
    : args._[0];

  if (isOptionEnabled(args.version)) {
    console.log(`TaskLog CLI - Version ${version}`);
    return 0;
  }

  if (isOptionEnabled(args.help)) {
    showHelp();
    return 0;
  }

  const context: TaskContext = {
    dataFilePath,
    eventLogPath,
    timeLogPath,
  };

  switch (command) {
    case Command.Add: {
      await processAdd(args, context);
      return 0;
    }
    case Command.List: {
      await processList(args, context);
      return 0;
    }
    case Command.Done: {
      await processDone(args, context);
      return 0;
    }
    case Command.Start: {
      await startTask(
        String(args._[1]),
        dataFilePath,
        eventLogPath,
        timeLogPath,
      ).catch((err) => {
        console.error("タスク開始中にエラーが発生しました:", err);
      });
      return 0;
    }
    case Command.Stop: {
      await stopTask(
        String(args._[1]),
        dataFilePath,
        eventLogPath,
        timeLogPath,
      ).catch((err) => {
        console.error("タスク開始中にエラーが発生しました:", err);
      });
      return 0;
    }
    case Command.Delete: {
      await deleteTask(
        String(args._[1]),
        dataFilePath,
        eventLogPath,
      ).catch((err) => {
        console.error("タスク削除中にエラーが発生しました:", err);
      });
      return 0;
    }
    case Command.Clear: {
      await clearTask(dataFilePath, eventLogPath).catch((err) => {
        console.error("タスククリア中にエラーが発生しました:", err);
      });
      return 0;
    }

    default: {
      console.log("未対応のコマンドです: " + args._[0]);
      showHelp();
      return 1;
    }
  }
}

if (import.meta.main) {
  const parsedArgs: Args = parseArgs(Deno.args, {
    string: [
      "status",
      "overtime",
      "title",
      "plannedMinutes",
      "version",
      "help",
    ],
  });
  const code = await main(parsedArgs).catch((err) => {
    console.error("エラーが発生しました:", err);
    return 1;
  });
  Deno.exit(code);
}

export function isOptionEnabled(val: unknown): boolean {
  return val === true || val === "true" || val === "";
}

export function showHelp(): void {
  console.log(`
TaskLog CLI - タスクを管理しタスクにかかる時間を記録するツール
バージョン: ${version}
使用可能なコマンド:
  - add <タイトル> <予定時間> タスクを追加します
  - list [--status=pending|in_progress|completed] [--overtime] [--title=タイトル] [--plannedMinutes=時間] タスクを一覧表示します。オプションで絞り込みが可能です
  - done <タスクID> タスクを完了します
  - start <タスクID> タスクにかかる時間の計測を開始します
  - stop <タスクID> タスクの時間の計測を停止します
  - delete <タスクID> タスクを削除します
  - clear タスクを全てクリアします
  `);
}
