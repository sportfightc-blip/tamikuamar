"use client";

import { useMemo } from "react";
import { supabase } from "../supabase/client";
import { useSupabaseTable } from "./useSupabaseTable";
import { CleaningType, RoomId, TaskCompletion } from "../types";

interface TaskCompletionRow {
  id: string;
  date: string;
  room_id: string;
  type: string;
  completed: boolean;
  completed_at: string | null;
}

function taskKey(date: string, roomId: RoomId, type: CleaningType): string {
  return `${date}:${roomId}:${type}`;
}

function rowToTask(row: TaskCompletionRow): TaskCompletion {
  return {
    id: row.id,
    date: row.date,
    roomId: row.room_id as RoomId,
    type: row.type as CleaningType,
    completed: row.completed,
    completedAt: row.completed_at,
  };
}

export function useTaskCompletions() {
  const { rows } = useSupabaseTable<TaskCompletionRow>("task_completions");
  const completions = useMemo(() => rows.map(rowToTask), [rows]);

  function isCompleted(date: string, roomId: RoomId, type: CleaningType): boolean {
    return completions.some((c) => c.id === taskKey(date, roomId, type) && c.completed);
  }

  function getCompletedAt(date: string, roomId: RoomId, type: CleaningType): string | null {
    return completions.find((c) => c.id === taskKey(date, roomId, type))?.completedAt ?? null;
  }

  async function toggleTask(date: string, roomId: RoomId, type: CleaningType): Promise<void> {
    const id = taskKey(date, roomId, type);
    const existing = completions.find((c) => c.id === id);
    const nextCompleted = !(existing?.completed ?? false);

    const { error } = await supabase.from("task_completions").upsert({
      id,
      date,
      room_id: roomId,
      type,
      completed: nextCompleted,
      completed_at: nextCompleted ? new Date().toISOString() : null,
    });
    if (error) throw error;
  }

  return { completions, isCompleted, getCompletedAt, toggleTask };
}
