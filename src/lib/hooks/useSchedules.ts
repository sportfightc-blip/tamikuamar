"use client";

import { v4 as uuid } from "uuid";
import { schedulesCollection } from "../db/collections";
import { useCollection } from "./useCollection";
import { DailyOperation, Schedule, ScheduleType, WeeklyOperation } from "../types";

export function useSchedules() {
  const schedules = useCollection(schedulesCollection);

  function addSchedule(
    date: string,
    type: ScheduleType,
    generatedMessage: string,
    snapshot: DailyOperation | WeeklyOperation,
  ): Schedule {
    const schedule: Schedule = {
      id: uuid(),
      date,
      type,
      generatedMessage,
      snapshot,
      createdAt: new Date().toISOString(),
    };
    schedulesCollection.update((current) => [schedule, ...current]);
    return schedule;
  }

  function removeSchedule(id: string): void {
    schedulesCollection.update((current) => current.filter((s) => s.id !== id));
  }

  const sorted = [...schedules].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));

  return { schedules: sorted, addSchedule, removeSchedule };
}
