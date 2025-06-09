import { EventLog } from "../types/eventLog.ts";

export async function saveLogEvent(path: string, event: EventLog) {
  await Deno.writeTextFile(path, JSON.stringify(event) + "\n", {
    append: true,
  });
}
