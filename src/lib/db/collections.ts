import { Schedule, Stay, TaskCompletion, Settings } from "../types";
import { DEFAULT_SETTINGS } from "../settings";
import { DB_KEYS } from "./keys";
import { LocalCollection } from "./localCollection";

export const staysCollection = new LocalCollection<Stay[]>(DB_KEYS.stays, []);
export const taskCompletionsCollection = new LocalCollection<TaskCompletion[]>(
  DB_KEYS.taskCompletions,
  [],
);
export const schedulesCollection = new LocalCollection<Schedule[]>(DB_KEYS.schedules, []);
export const settingsCollection = new LocalCollection<Settings>(
  DB_KEYS.settings,
  DEFAULT_SETTINGS,
);
export const seededCollection = new LocalCollection<boolean>(DB_KEYS.seeded, false);
