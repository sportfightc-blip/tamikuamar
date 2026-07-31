"use client";

import { useMemo } from "react";
import { supabase } from "../supabase/client";
import { useSupabaseTable } from "./useSupabaseTable";
import { DailyOperation, Schedule, ScheduleType, WeeklyOperation } from "../types";

interface ScheduleRow {
  id: string;
  date: string;
  type: string;
  generated_message: string;
  snapshot: DailyOperation | WeeklyOperation;
  created_at: string;
}

function rowToSchedule(row: ScheduleRow): Schedule {
  return {
    id: row.id,
    date: row.date,
    type: row.type as ScheduleType,
    generatedMessage: row.generated_message,
    snapshot: row.snapshot,
    createdAt: row.created_at,
  };
}

export function useSchedules() {
  const { rows } = useSupabaseTable<ScheduleRow>("schedules", {
    column: "created_at",
    ascending: false,
  });
  const schedules = useMemo(() => rows.map(rowToSchedule), [rows]);

  async function addSchedule(
    date: string,
    type: ScheduleType,
    generatedMessage: string,
    snapshot: DailyOperation | WeeklyOperation,
  ): Promise<void> {
    const { error } = await supabase.from("schedules").insert({
      date,
      type,
      generated_message: generatedMessage,
      snapshot,
    });
    if (error) throw error;
  }

  async function removeSchedule(id: string): Promise<void> {
    const { error } = await supabase.from("schedules").delete().eq("id", id);
    if (error) throw error;
  }

  return { schedules, addSchedule, removeSchedule };
}
